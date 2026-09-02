type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/bn-mark.png"
      alt=""
      className={`${className} rounded-xl object-contain brightness-0 invert`}
    />
  );
}
