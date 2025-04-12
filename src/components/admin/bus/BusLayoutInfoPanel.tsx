
export const BusLayoutInfoPanel = () => {
  return (
    <div className="bg-muted p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-4">Supported Layout Types</h3>
      <ul className="space-y-2 list-disc pl-5">
        <li>1X2 Bus Seating with Sleeper (Upper deck)</li>
        <li>2X2 Standard Seater Configuration</li>
        <li>2X1 Semi-Sleeper Configuration</li>
        <li>Custom configurations via JSON upload</li>
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        You can also save layouts directly from the seat selection interface when booking a trip.
      </p>
    </div>
  );
};
