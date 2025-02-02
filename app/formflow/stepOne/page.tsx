export default function StepOne({ nextStep }: { nextStep: () => void }) {
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h2 className="text-xl font-bold">Step One</h2>
      <p>Enter your details below:</p>
      <input
        type="text"
        placeholder="Your name"
        className="border p-2 mt-2 block w-full"
      />
      <button
        onClick={nextStep}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Next
      </button>
    </div>
  );
}
