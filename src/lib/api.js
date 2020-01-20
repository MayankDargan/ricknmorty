import axios from "axios";
import NodeCache from "node-cache";
// import logger from "./logger";


const minutesAsSeconds = (n) => n * 60;
const cache = new NodeCache({ stdTTL: minutesAsSeconds(10) });

const defaultRequestOptions = {
    baseUrl: "https://rickandmortyapi.com/api",
  };
  
  export async function get(path, options) {
    const cachedResult = cache.get(path);
    if (cachedResult) {
    //   logger.debug(`cache hit for ${path}`);
      return cachedResult;
    }
  
    // logger.debug(`cache miss for ${path}`);
    const { data } = await axios.get(`${options.baseUrl}${path}`);
    cache.set(path, data);
    return data;
  }
  
  export function getAllCharacters(options = defaultRequestOptions) {
    return get("/character/?page=1", options);
  }

  export function getMoreCharacters(id,options = defaultRequestOptions) {
    return get(`/character/?page=${id}`, options);
  }
  
  export function getCharactersByName(name, options = defaultRequestOptions) {
    return get(`/character/?${name}`, options);
  }
  
  export function getCharacterById(id, options = defaultRequestOptions) {
    return get(`/character/${id}`, options);
  }
  
  export function getCharactersByIds(ids, options = defaultRequestOptions) {
    return get(`/character/${ids.join(",")}`, options);
  }
  