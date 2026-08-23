/**
 * Renseigne le lieu (`location`) des événements internes qui n'en ont pas,
 * avec la salle du club définie dans `constant/config.ts`.
 *
 * Simulation par défaut. Rien n'est écrit sans `--apply`.
 *
 *   node --env-file=.env.local scripts/backfill-event-location.mjs
 *   node --env-file=.env.local scripts/backfill-event-location.mjs --apply
 *
 * Un événement interne qui s'est tenu ailleurs doit être renseigné à la main
 * (Studio ou patch ciblé) AVANT de lancer ce script avec `--apply`.
 */
import { associationConfig } from '../constant/config.ts';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-30';
const apply = process.argv.includes('--apply');

const fail = (message) => {
    console.error(message);
    process.exit(1);
};

if (!projectId || !dataset || !token) {
    fail(
        'Variables manquantes : NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN'
    );
}

const api = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
};

const { venue } = associationConfig;
const location = {
    name: venue.name,
    streetAddress: venue.streetAddress,
    postalCode: venue.postalCode,
    city: venue.city,
};

// Événements internes sans lieu. Les brouillons (`drafts.`) sont exclus :
// un éditeur en cours de saisie ne doit pas voir son document changer.
const query = `*[_type == "evenement" && origin == "internal" && !defined(location) && !(_id in path("drafts.**"))]{ _id, title }`;

const listMissing = async () => {
    const res = await fetch(
        `${api}/query/${dataset}?query=${encodeURIComponent(query)}&perspective=published`,
        { headers }
    );
    if (!res.ok) fail(`Lecture Sanity impossible : ${res.status} ${await res.text()}`);
    return (await res.json()).result;
};

const applyLocation = async (events) => {
    // `setIfMissing` : n'écrase jamais un lieu saisi entre-temps dans le Studio
    const mutations = events.map((e) => ({
        patch: { id: e._id, setIfMissing: { location } },
    }));
    const res = await fetch(`${api}/mutate/${dataset}?returnIds=true`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ mutations }),
    });
    if (!res.ok) fail(`Écriture Sanity refusée : ${res.status} ${await res.text()}`);
    return (await res.json()).results;
};

const events = await listMissing();

if (events.length === 0) {
    console.log('Aucun événement interne sans lieu. Rien à faire.');
} else {
    console.log(
        `${events.length} événement(s) interne(s) sans lieu → ${location.name}, ${location.streetAddress}, ${location.postalCode} ${location.city}`
    );
    for (const e of events) console.log(`  - ${e._id}  ${e.title}`);

    if (apply) {
        const results = await applyLocation(events);
        console.log(`\n${results.length} document(s) mis à jour.`);
    } else {
        console.log('\nSimulation. Relancer avec --apply pour écrire.');
    }
}
