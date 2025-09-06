type EventOriginBadgeProps = {
    origin?: 'internal' | 'external';
    className?: string;
};

export function EventOriginBadge(props: EventOriginBadgeProps) {
    const { origin, className } = props;
    // Par défaut, considérer comme "interne" si le champ est manquant (compatibilité anciens contenus)
    const isExternal = origin === 'external';
    const base =
        'inline-flex items-center rounded-full px-3 py-1 text-[10px] md:text-xs tracking-wide shadow-lg backdrop-blur ring-1 border font-bold';
    const theme = isExternal
        ? 'bg-amber-500/15 text-amber-300 ring-amber-400/30 border-amber-400/30'
        : 'bg-jkdBlue/15 text-jkdBlue ring-jkdBlue/30 border-jkdBlue/30';

    return (
        <span className={`${base} ${theme} ${className ?? ''}`}>
            {isExternal
                ? 'Evénement externe au club'
                : 'Evénement JKD Self Defense 31'}
        </span>
    );
}
