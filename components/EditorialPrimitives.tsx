import type { ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface RuleProps {
  className?: string;
}

export function Rule({ className }: RuleProps) {
  return (
    <hr
      aria-hidden="true"
      className={joinClasses("editorial-rule", className)}
    />
  );
}

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
  as?: "p" | "span";
}

export function Eyebrow({
  children,
  className,
  as: Component = "p",
}: EyebrowProps) {
  return (
    <Component className={joinClasses("editorial-eyebrow", className)}>
      {children}
    </Component>
  );
}

export interface SectionHeadingProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  level?: 2 | 3;
  className?: string;
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  level = 2,
  className,
}: SectionHeadingProps) {
  const Heading = level === 3 ? "h3" : "h2";

  return (
    <header className={joinClasses("section-heading", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading className="section-heading__title">{title}</Heading>
      {description ? (
        <div className="section-heading__description">{description}</div>
      ) : null}
    </header>
  );
}

export interface EditorialImageProps {
  src: ImageProps["src"];
  alt: string;
  caption?: ReactNode;
  credit?: ReactNode;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  variant?: "landscape" | "portrait" | "square" | "wide";
}

export function EditorialImage({
  src,
  alt,
  caption,
  credit,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  quality,
  fill = false,
  width,
  height,
  className,
  imageClassName,
  variant = "landscape",
}: EditorialImageProps) {
  const sizingProps = fill
    ? ({ fill: true } as const)
    : ({ width: width ?? 1752, height: height ?? 898 } as const);

  return (
    <figure
      className={joinClasses("editorial-image", className)}
      data-variant={variant}
    >
      <div className="editorial-image__frame">
        <Image
          {...sizingProps}
          src={src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          quality={quality}
          unoptimized={process.env.NODE_ENV !== "production"}
          className={joinClasses("editorial-image__media", imageClassName)}
        />
      </div>
      {caption || credit ? (
        <figcaption className="editorial-image__caption">
          {caption ? (
            <span className="editorial-image__caption-text">{caption}</span>
          ) : null}
          {credit ? (
            <span className="editorial-image__credit">{credit}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export type ArrowDirection = "right" | "left" | "down" | "up-right";

const ARROW_GLYPHS: Record<ArrowDirection, string> = {
  right: "→",
  left: "←",
  down: "↓",
  "up-right": "↗",
};

export interface ArrowGlyphProps {
  direction?: ArrowDirection;
  className?: string;
}

export function ArrowGlyph({
  direction = "right",
  className,
}: ArrowGlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={joinClasses("arrow-glyph", className)}
      data-direction={direction}
    >
      {ARROW_GLYPHS[direction]}
    </span>
  );
}

export interface CTAAction {
  href: string;
  label: string;
}

export interface CTABlockProps {
  headline: ReactNode;
  body?: ReactNode;
  eyebrow?: ReactNode;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
  className?: string;
}

export function CTABlock({
  headline,
  body,
  eyebrow,
  primaryAction,
  secondaryAction,
  className,
}: CTABlockProps) {
  return (
    <section className={joinClasses("cta-block", className)}>
      <div className="cta-block__content">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="cta-block__headline">{headline}</h2>
        {body ? <div className="cta-block__body">{body}</div> : null}
      </div>
      <div className="cta-block__actions">
        <Link
          className="cta-block__link cta-block__link--primary"
          href={primaryAction.href}
        >
          <span>{primaryAction.label}</span>
          <ArrowGlyph />
        </Link>
        {secondaryAction ? (
          <Link
            className="cta-block__link cta-block__link--secondary"
            href={secondaryAction.href}
          >
            <span>{secondaryAction.label}</span>
            <ArrowGlyph />
          </Link>
        ) : null}
      </div>
    </section>
  );
}

export interface ProofItem {
  label: ReactNode;
  detail?: ReactNode;
}

export interface ProofBandProps {
  items: ProofItem[];
  label?: string;
  className?: string;
}

export function ProofBand({
  items,
  label = "Areas of expertise",
  className,
}: ProofBandProps) {
  return (
    <section
      aria-label={label}
      className={joinClasses("proof-band", className)}
    >
      <ul className="proof-band__list">
        {items.map((item, index) => (
          <li className="proof-band__item" key={index}>
            <span className="proof-band__label">{item.label}</span>
            {item.detail ? (
              <span className="proof-band__detail">{item.detail}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
