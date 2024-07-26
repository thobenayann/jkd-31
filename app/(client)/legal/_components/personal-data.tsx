export default function PersonalData() {
    return (
        <div className='text-white'>
            <h2 className='text-2xl font-bold mb-2'>Données Personnelles</h2>
            <p className='text-gray-300 mb-4'>
                Lorsque vous utilisez le formulaire de contact de notre site,
                nous collectons les informations suivantes :
            </p>
            <ul className='list-disc pl-5 text-gray-300 mb-4'>
                <li>Prénom</li>
                <li>Nom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Message</li>
            </ul>
            <p className='text-gray-300 mb-4'>
                Ces données sont utilisées exclusivement pour répondre à vos
                demandes d&apos;information, gérer vos réservations, ou vous
                fournir les services que vous avez demandés. Elles ne sont
                conservées que le temps nécessaire à ces fins.
            </p>
        </div>
    );
}
