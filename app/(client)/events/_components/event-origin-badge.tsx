type EventOriginBadgeProps = {
    origin?: 'internal' | 'external';
    className?: string;
};

export function EventOriginBadge(props: EventOriginBadgeProps) {
    const { origin, className } = props;
    // Par défaut, considérer comme "interne" si le champ est manquant (compatibilité anciens contenus)
    const isExternal = origin === 'external';
    const base =
        'inline-flex items-center rounded-full px-3 py-1 text-[10px] md:text-xs tracking-wide font-semibold text-white shadow-lg border';
    // Gradient haute-contraste: noir -> couleur accent
    const theme = isExternal
        ? 'bg-[linear-gradient(135deg,#000_0%,#0a0a0a_50%,#F9DB06_100%)] border-[#F9DB06]'
        : 'bg-[linear-gradient(135deg,#000_0%,#0a0a0a_50%,#E20614_100%)] border-[#E20614]';

    return (
        <span className={`${base} ${theme} ${className ?? ''}`}>
            {isExternal
                ? 'Evénement externe au club'
                : 'Evénement JKD Self Defense 31'}
        </span>
    );
}
