import { useEffect, useState } from "react";
import BasicJobInput from "./BasicJobInput";
import DescriptionItem from "./DescriptionItem";
import SelectorInput from "./SelectorInput";
import FormButton from "../../../components/FormButton";

const descriptions = [
  {
    id: 1,
    title: "Job Description (required)",
    name: "job_description",
    desc: "Job titles must be describe one position",
    placeholder: "Enter a job decription",
  },
  {
    id: 2,
    title: "Experience",
    name: "experience",
    desc: "Outline the experices reqyired for the Job",
    placeholder: "Begin to type...",
  },
];

const basic_inputs = [
  {
    id: 1,
    name: "job_title",
    label: "Job Title (required)",
    type: "text",
    placeholder: "e.g FrontEnd Dev",
    prompt: "Here you state the job title",
  },
  {
    id: 2,
    name: "external_url",
    label: "External URL ",
    type: "text",
    placeholder: "e.g https://externalurl.com",
    prompt: "Here you can add any external url",
  },
  {
    id: 3,
    name: " introduction_video_url",
    label: "Intro Video Url",
    type: "text",
    placeholder: "e.g https://introvideourl.com",
    prompt: "Here you add intro videp url",
  },
];

const careerData = [
  {
    id: 1,
    name: "Entry Level",
  },
  {
    id: 2,
    name: "Mid Level",
  },
  {
    id: 3,
    name: "Senoir Level",
  },
];

function Descriptions({ data, setCurrentStep, jobUtils, handleSuccess }) {
  const [selectedCareerLevel, setSelectedCareerLevel] = useState(careerData[1]);

  useEffect(() => {
    jobUtils.setDetails({
      ...jobUtils.details,
      ["current_level"]: selectedCareerLevel.name,
    });
  }, [selectedCareerLevel]);

  return (
    <div className="flex w-full flex-col p-2">
      {/* Descriptions */}
      <div className="flex flex-col gap-[15px] border-b pb-2">
        <h3 className="text-gray-700 text-sm font-semibold">Details</h3>
        <span className="text-little text-gray-400">
          Add the description of the job, responsibilities, who you are, and
          nice-to-haves.{" "}
        </span>
      </div>

      {/* Basic Inputs */}
      {basic_inputs.map((current) => (
        <BasicJobInput key={current.id} data={current} jobUtils={jobUtils} />
      ))}

      {/* Job Description */}
      <>
        {descriptions.map((current, index) => (
          <DescriptionItem key={index} data={current} jobUtils={jobUtils} />
        ))}
      </>

      {/*  */}
      <SelectorInput
        key={1}
        data={{
          label: "Career Level",
          prompt: "Here you select prefered career level",
          name: "career_level",
        }}
        listData={careerData}
        jobUtils={jobUtils}
        selected={selectedCareerLevel}
        setSelected={setSelectedCareerLevel}
      />

      <div className="w-full flex  mt-[10px] justify-between">
        <button
          onClick={() => setCurrentStep(data[0])}
          className="p-2 place-self-end  font-semibold w-fit text-little bg-primaryColor text-white"
        >
          Previous Step
        </button>
        
        <FormButton
          width="w-[100px]"
          height="h-fit p-2"
          onClick={() => {
            jobUtils.addJob(() => {
              handleSuccess()
            })
          }}
          loading={jobUtils.loading}
          
        >
          Add Job
        </FormButton>
      </div>
    </div>
  );
}

export default Descriptions;