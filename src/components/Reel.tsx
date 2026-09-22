/* Edge-to-edge grayscale portrait reel. The order is fixed and the sequence is
   repeated once, so the CSS loop (translateX -50%) is seamless. */
const PHOTOS = [
  "m10", "m07", "m01", "m06", "m02", "m04", "m14", "m11",
  "m13", "m05", "m12", "m09", "m08", "m15", "m03", "m16",
];

export function Reel() {
  return (
    <div className="reel" aria-hidden="true">
      <div className="reel-track">
        {[0, 1].map((pass) =>
          PHOTOS.map((photo) => (
            /* eslint-disable-next-line @next/next/no-img-element -- decorative, fixed size, already optimised */
            <img
              key={`${pass}-${photo}`}
              src={`/img/${photo}.jpg`}
              alt=""
              width={414}
              height={560}
              loading={pass === 0 ? "eager" : "lazy"}
            />
          )),
        )}
      </div>
    </div>
  );
}
