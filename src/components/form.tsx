
import { useForm, useFieldArray } from "react-hook-form";
import { ToggleLeft, ToggleRight, X } from 'lucide-react';
import { Toggle } from "./ui/toggle";
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";
import * as React from "react";
import NestedFields from "./nestedfield";
import { Plus } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';


interface Property{
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'float' | 'nested';
  required: boolean;
  properties?: Property[]; 
}

interface FormData{
  properties: Property[];
}

function buildSchema(properties: Property[]){
  const obj: any = {};
  properties.forEach((prop) =>{
    if(!prop.name) return;
    if(prop.type === 'nested' && prop.properties){
      obj[prop.name] = buildSchema(prop.properties);
    }
    else{
      obj[prop.name] = prop.type;
    }
    })
    return obj;

}




// JsonSchemaBuilder 

const JsonSchemaBuilder: React.FC= () => {

  const notify =() => toast.dark("Schema generated successfully",{
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,  
    draggable: true,
    progress: undefined,
    
  })
 
  const { register, handleSubmit, control,watch,setValue } = useForm<FormData>({
    defaultValues:{
      properties: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "properties",
  });

  const properties  =watch("properties") || [];
  const onSubmit = (data: FormData) => {
   
    console.log(data);       
  };

    const schema = buildSchema(properties);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col bg-white p-4 rounded min-w-[300px] min-h-[200px]">
      <form onSubmit={handleSubmit(onSubmit)} >

        {/* dynamic fields */}
       
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="border border-gray-200 rounded shadow-sm bg-white px-4 py-3">
                <div className="flex flex-row items-center gap-3">
                  <Input
                    {...register(`properties.${index}.name`, {
                      required: "Property name is required",
                    })}
                    placeholder="First Name"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <select
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-gray-100 transition-colors duration-150"
                    {...register(`properties.${index}.type`, {
                      required: "Property name is required",
                    })}
                  >
                    <option value="string">string</option>
                    <option value="float">float</option>
                    <option value="number">number</option>
                    <option value="nested">nested</option>
                    <option value="boolean">boolean</option>
                    <option value="array">array</option>
                    <option value="object">Object</option>
                  </select>
                  <Toggle
                    aria-label="Required"
                    pressed={!!watch(`properties.${index}.required`)}
                    onPressedChange={(pressed) =>
                      setValue(`properties.${index}.required`, pressed)
                    }
                    className="mx-1"
                  >
                    {watch(`properties.${index}.required`) ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
                  </Toggle>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} color="gray" />
                  </button>
                </div>
                {watch(`properties.${index}.type`) === "nested" && (
                  <div className="ml-8 mt-3 border-l-2 border-gray-100 pl-4">
                    <NestedFields
                      nestIndex={index}
                      register={register}
                      control={control}
                      watch={watch}
                      setValue={setValue}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Property button */}

        <div className="flex flex-row gap-4 items-center mt-4">
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
          Add Property
          </Button>
        

        <Button type="submit" variant="secondary"
        onClick={notify}
        >Submit</Button>
        <ToastContainer />
        </div>
      </form>
      </div>

      {/* json displaced here */}
      <div id="json-display" className="flex-1 mt-4 bg-gray-100 p-4 whitespace-pre-wrap font-mono max-w-[500px] min-h-[200px]"
        >

      
        {Object.keys(schema).length > 0
          ? JSON.stringify(schema, null, 2)
          : "No properties added"}
        
      </div>
      </div>
    </div>
  );
}

export default JsonSchemaBuilder;
