export default function StepTwo({ prevStep }: { prevStep: () => void }) {
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h2 className="text-xl font-bold">Step Two</h2>
      <p>Confirm your details and submit:</p>
      <button
        onClick={prevStep}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
      >
        Back
      </button>
      <button className="mt-4 ml-2 bg-green-500 text-white px-4 py-2 rounded-md">
        Submit
      </button>
    </div>
  );
}
