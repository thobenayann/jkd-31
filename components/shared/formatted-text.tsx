import React from 'react';

type FormattedTextProps = {
    text: string | undefined;
    className?: string;
};

export function FormattedText({ text, className = '' }: FormattedTextProps) {
    if (!text) return null;

    // Diviser le texte en paragraphes (séparés par des doubles sauts de ligne)
    const paragraphs = text.split(/\n\s*\n/);

    return (
        <div className={className}>
            {paragraphs.map((paragraph, index) => (
                <p key={index} className='mb-4'>
                    {/* Remplacer les sauts de ligne simples par des <br /> */}
                    {paragraph.split('\n').map((line, lineIndex, array) => (
                        <React.Fragment key={lineIndex}>
                            {line}
                            {lineIndex < array.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
            ))}
        </div>
    );
}
