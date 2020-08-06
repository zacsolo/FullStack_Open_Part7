import { useState } from 'react';
import axios from 'axios';

//--STANDARD INPUT HOOK FOR HANDLING FIELDS
export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

//--ADD A NEW RESOURCE TO THE DB
export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  //--FETCH METHOD TO BE CALLED IN USEEFFECT IN PARENT
  const fetch = async () => {
    const response = await axios.get(baseUrl);
    setResources(response.data);
  };

  const create = async (resource) => {
    await axios.post(baseUrl, resource);
    fetch();
  };

  const service = {
    create,
    fetch,
  };

  //--FIRST PARAM RETURNS ALL OF THE RESOURCES
  //--SECOND RETURNS AN OBJECT THAT CAN BE USED TO
  //--MANIPULATE THE DATA
  return [resources, service];
};
