export default function LaunchInfo() {
  return (
    <div className="text-left text-white">
      <span className="text-gradient font-bold text-4xl mb-3 block">Next Launch</span>
      <span className="block text-3xl font-bold">CAS500-1</span>
      <span className="block text-xl">Roscosmos &bull; Soyuz-2</span>
      <div className="block">
        <svg
          className="inline text-gradient"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(30)">
              <stop offset="0%" style={{ stopColor: '#22c0d6; stop-opacity:1' }} />
              <stop offset="100%" style={{ stopColor: '#89e3be; stop-opacity:1' }} />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient)"
            d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
          />
        </svg>
        <span>&nbsp;LC-31/6, Baikonur Cosmodrome, Kazakhstan</span>
      </div>
    </div>
  );
}
