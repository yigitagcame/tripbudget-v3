import Image from 'next/image';

const platforms = [
  {
    logo: '/platforms/booking.svg'
  },
  {
    logo: '/platforms/kayak.png'
  },
  {
    logo: '/platforms/kiwi.svg'
  },
  {
    logo: '/platforms/omio.svg'
  }
];

export default function PlatformsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Data from Trusted Travel Platforms
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We gather real-time data from the world's most trusted travel platforms, so you can compare prices and find the best deals with confidence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <Image
                  src={platform.logo}
                  alt="Travel platform logo"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            <span className="font-semibold">More platforms coming soon!</span> We're constantly expanding our data sources to provide you with the most comprehensive travel planning experience.
          </p>
        </div>
      </div>
    </section>
  );
} 