import { ServiceDescription as ServiceDescriptionType } from "@/types";

interface Props {
  service: ServiceDescriptionType;
}

export const ServiceDescription = ({ service }: Props) => {
  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{service.icon}</div>
        <div className="flex-1">
          <h4 className="text-white font-medium text-sm mb-1 flex items-center gap-2">
            {service.title}
          </h4>
          <p className="text-gray-400 text-xs leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
};
