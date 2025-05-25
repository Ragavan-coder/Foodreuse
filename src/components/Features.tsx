
import { Share, ListCheck, Clock, Calendar } from "lucide-react";

const Features = () => {
  const features = [
    {
      name: 'Easy Donation Listings',
      description: 'List your excess food in just a few clicks. Specify what you have, when it expires, and preferred pickup times.',
      icon: ListCheck,
    },
    {
      name: 'Real-Time Updates',
      description: 'Get instant notifications when your food has been claimed or when new donations are available nearby.',
      icon: Clock,
    },
    {
      name: 'Impact Tracking',
      description: "Track the environmental impact of your donations and see how many meals you've helped provide to those in need.",
      icon: Calendar,
    },
    {
      name: 'Community Building',
      description: 'Connect with like-minded individuals and organizations in your area who are committed to reducing food waste.',
      icon: Share,
    },
  ];

  return (
    <div id="features" className="bg-green-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">Better for everyone</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Reducing food waste has never been easier
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            FoodRescue provides the tools to connect food donors with recipients efficiently and effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-green-500" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
