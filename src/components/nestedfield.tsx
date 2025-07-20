import { useFieldArray } from "react-hook-form";
import { ToggleLeft, ToggleRight, X } from 'lucide-react';
import { Toggle } from "./ui/toggle";
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";
import * as React from "react";
import { Plus } from "lucide-react";

const NestedFields: React.FC<{
 register:any,
  control:any,
  nestIndex : number,
  watch?: any,
  setValue?: any,
}
> = ({nestIndex, register, control, watch, setValue}) => {
  

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: `properties.${nestIndex}.properties `,
  });

  return (
    <>
      {/* dynamic fields */}
      <div className="flex flex-col">
        {fields.map((field, index) => {
          return (
            <React.Fragment key={field.id}>
            <div  className="flex flex-row items-center mb-2 ">
              <Input
                {
                  ...register(`properties.${nestIndex}.properties.${index}.name`, {
                    required: "Property name is required",
                  })
                }
                placeholder="First Name"
                className="border border-gray-300 rounded p-2 m-2"
              />

              {/* OPTIONAL values */}
              <select
                className="border border-gray-300 rounded p-2 m-2"
                {
                  ...register(`properties.${nestIndex}.properties.${index}.type`, {
                    required: "Property name is required",
                  })
                }
              >
                <option value="string">string</option>
                <option value="float">float</option>
                <option value="number">number</option>
                <option value="nested">nested</option>
                <option value="boolean">boolean</option>
                <option value="array">array</option>
                <option value="object">Object</option>
              </select>

              {/* required checkbox */}
              <Toggle
                    aria-label="Required"
                    pressed={!!watch(`properties.${index}.required`)}
                    onPressedChange={(pressed) =>
                      setValue(`properties.${index}.required`, pressed)
                    }
                    className={`
                                
                                `} 

                  >
                    {watch(`properties.${index}.required`) ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
                    
                  </Toggle>

              {/* remove button */}
              <button type="button"
                  onClick={()=> remove(index)}
                  className=" text-white p-2 rounded ml-2"
                  >
                  <X size={25} color="black" />
                </button>
            </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Add Property button */}
      <Button
        type="button"
          onClick={() =>
            append({
              name:"",
              type: 'string',
              required: false,
            })
          }
        variant={"outline"}>
          <Plus size={16} />
          Add Property</Button>
    </>
  )
}


export default NestedFields;