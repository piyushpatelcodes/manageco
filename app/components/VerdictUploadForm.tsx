import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Loader2,
  Plus,
  Trash2,
  Tag,
  FlaskConical,
  PlusCircle,
  CopyPlus,
  FlaskConicalOff,
} from "lucide-react";
import FileUpload from "./FileUpload";
import { useNotification } from "./Notification";

interface Score {
  name: string;
  value?: string | number;
  unit?: string;
  range?: [number, number];
  expectedRange?: [number, number];
  remarks?: string;
  relatedTo: string;
  verdict:boolean;
}

interface ReportFormData {
  fileUrl: string;
  fileType: string;
  fileSize: number;
  imageKitFileId: string;
  score: Score[];
}

interface TestOption {
  label: string;
  value: string;
}

export default function UploadVerdictForm({
  reportId,
  closeModal,
}: {
  reportId: string | undefined;
  closeModal: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  const [TestOptions, setTestOptions] = useState<TestOption[]>([
    { label: "Process", value: "Process" },
    { label: "Strength", value: "Strength" },
    { label: "Fastness", value: "Fastness" },
    { label: "Longevity Test", value: "Longevity" },
    { label: "Durability", value: "Durability" },
    { label: "Battery Life Test", value: "Battery Life Test" },
    { label: "Shelf life Test", value: "Shelf life" },
  ]);

  const [newTestCategory, setNewTestCategory] = useState("");
  const [selectedTests, setSelectedTests] = useState<TestOption[]>([]);

  const { register, handleSubmit, setValue, control, getValues } =
    useForm<ReportFormData>({
      defaultValues: {
        fileUrl: "",
        fileType: "",
        fileSize: 0,
        imageKitFileId: "",
        score: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "score",
  });

  const handleUploadSuccess = ({
    filePath,
    size,
    fileId,
  }: {
    filePath: string;
    size: number;
    fileId: string;
  }) => {
    setValue("fileUrl", filePath);
    setValue("fileSize", size);
    setValue("fileType", filePath.split(".").pop() || "Document");
    setValue("imageKitFileId", fileId);
    showNotification("Document uploaded successfully!", "success");
  };

  const handleCheckboxChange = (option: TestOption) => {
    const isSelected = selectedTests.some((t) => t.value === option.value);

    if (isSelected) {
      setSelectedTests((prev) => prev.filter((t) => t.value !== option.value));
      const indexToRemove = fields.findIndex(
        (field) => field.name === option.label
      );
      if (indexToRemove !== -1) remove(indexToRemove);
    } else {
      setSelectedTests((prev) => [...prev, option]);
      append({ name: option.label, relatedTo: option.value , verdict:true});
    }
  };

  const handleAddCustomTestCategory = (categoryName: string) => {
    const newCategory = {
      label: categoryName,
      value: categoryName.toLowerCase(),
    };
    if (
      categoryName.trim() &&
      !TestOptions.some((opt) => opt.value === newCategory.value)
    ) {
      setTestOptions((prev) => [...prev, newCategory]);
      setSelectedTests((prev) => [...prev, newCategory]);
      append({ name: categoryName, relatedTo:categoryName, verdict:true });
      setNewTestCategory("");
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    if (!reportId) {
      showNotification("Report ID is missing", "error");
      return;
    }

    try {
      setLoading(true);

      if (data.fileUrl) {
        const verdictRes = await fetch(
          `/api/report/${reportId}/upload-verdict`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, id: reportId }),
          }
        );
        if (!verdictRes.ok) throw new Error("Failed to upload verdict");
      }

      const validScores = data.score.filter((s) => s.name && s.value !== "");
      if (validScores.length > 0) {
        console.log("🚀 ~ onSubmit verdict ~ body:", ({ score: validScores }))
        const scoreRes = await fetch(`/api/report/${reportId}/upload-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: validScores }),
        });
        if (!scoreRes.ok) throw new Error("Failed to upload test scores");
      }

      if (!data.fileUrl && validScores.length === 0) {
        showNotification("Provide either file or test scores.", "warning");
        return;
      }

      showNotification("Verdict uploaded successfully!", "success");
      closeModal();
    } catch (err) {
      showNotification("Error uploading verdict", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Upload */}
      <div className="form-control">
        <label className="label text-lg font-semibold mb-2">
          Please Upload in PDF Format
        </label>
        <FileUpload
          onSuccess={handleUploadSuccess}
          onProgress={setUploadProgress}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-800 rounded-full h-2.5 mt-2">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Category Tests */}
      <div className="form-control">
        <fieldset className="fieldset bg-base-100 border-gray-600 rounded-box w-full border-2 p-4">
          <legend className="fieldset-legend flex gap-2 font-mono font-extrabold text-lg">
            <FlaskConical size={25} className="hover:text-primary" />
            Category Tests
          </legend>

          {/* Two-column layout for checkboxes */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
            {TestOptions.map((option, index) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedTests.some((t) => t.value === option.value)}
                  onChange={() => handleCheckboxChange(option)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Custom category input */}
        <div className="mt-3 mb-5 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Create a new category of tests"
            className="input input-sm input-bordered bg-gray-800 text-white w-full"
            value={newTestCategory}
            onChange={(e) => setNewTestCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                handleAddCustomTestCategory(newTestCategory);
            }}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline text-white flex gap-2"
            onClick={() => handleAddCustomTestCategory(newTestCategory)}
          >
            <CopyPlus /> Add
          </button>
        </div>
      </div>

      {/* Score Fields */}
      {fields.length > 0 ? (
        <div className="space-y-4">
          <label className="block text-lg font-semibold mb-3">
            Test Scores
          </label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="collapse collapse-arrow border border-gray-700 bg-gray-800 rounded-lg"
            >
              <input type="checkbox" className="collapse-toggle" />
              <div className="collapse-title p-4 bg-green-400/50 rounded-t-lg text-lg font-bold">
                Test Related to: {field.name || `Test ${index + 1}`}
              </div>
              <div className="collapse-content p-4">
                {/* Title field (full width) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="label">Test Name *</label>
                    <input
                      {...register(`score.${index}.name`)}
                      className="input input-bordered bg-gray-900 text-white w-full"
                      placeholder="Test Name"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <fieldset className="fieldset bg-gray-900 border-base-300 rounded-box w-72 border p-4">
                      <legend className="fieldset-legend">Verdict *</legend>
                      <div className="flex gap-20">
                        <label className="label cursor-pointer flex items-center gap-2">
                          <input
                            type="radio"
                            value="true"
                            {...register(`score.${index}.verdict`)}
                            defaultChecked
                            className="radio radio-success"
                          />
                          <span className="label-text text-white">Pass</span>
                        </label>
                        <label className="label cursor-pointer flex items-center gap-2">
                          <input
                            type="radio"
                            value="false"
                            {...register(`score.${index}.verdict`)}
                            className="radio radio-error"
                          />
                          <span className="label-text text-white">Fail</span>
                        </label>
                      </div>
                    </fieldset>
                  </div>

                  {/* Grid layout for fields */}
                  {/* Value */}
                  <div>
                    <label className="label">Value</label>
                    <input
                      {...register(`score.${index}.value`)}
                      className="input input-bordered bg-gray-900 text-white w-full"
                      placeholder="Value"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="label">Unit (mg/L, %)</label>
                    <input
                      {...register(`score.${index}.unit`)}
                      className="input input-bordered bg-gray-900 text-white w-full"
                      placeholder="Unit (mg/L, %)"
                    />
                  </div>

                  {/* Range Min */}
                  <div>
                    <label className="label">Range Min</label>
                    <input
                      {...register(`score.${index}.range.0`)}
                      type="number"
                      className="input input-bordered bg-gray-900 text-white w-full"
                      placeholder="Range Min"
                    />
                  </div>

                  {/* Range Max */}
                  <div>
                    <label className="label">Range Max</label>
                    <input
                      {...register(`score.${index}.range.1`)}
                      type="number"
                      className="input input-bordered bg-gray-900 text-white w-full"
                      placeholder="Range Max"
                    />
                  </div>
                </div>

                {/* Remarks (full width) */}
                <div className="mt-4">
                  <label className="label">
                    Remarks <span className="text-white/40">(Optional)</span>
                  </label>
                  <textarea
                    {...register(`score.${index}.remarks`)}
                    className="textarea bg-gray-900 text-white w-full"
                    placeholder="Remarks"
                  />
                </div>
              </div>
                <div className="col-span-full flex justify-end mb-2 mr-2">
              <button
                type="button"
                className="btn btn-sm btn-outline text-red-500"
                onClick={() => remove(index)}
              >
                Remove Test
              </button>
            </div>
            </div>
            
          ))}
        </div>
      ) : (
        <em className="italic m-2 flex items-center gap-4 bg-blue-600/40 p-2 rounded-lg font-mono justify-center text-sm text-white">
          <span className="flex-grow border-t border-white/40"></span>
          <FlaskConicalOff className="animate-pulse" size={18} />
          No Test Selected
          <span className="flex-grow border-t border-white/40"></span>
        </em>
      )}

      {/* Submit */}
      <div className="mt-6">
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading || (!getValues("fileUrl") && fields.length === 0)}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...
            </>
          ) : (
            "Send Document"
          )}
        </button>
      </div>
    </form>
  );
}
