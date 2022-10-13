import { async } from 'regenerator-runtime';

export const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (e) {
    throw e; // throw err again so it gets fired by model.js
    // console.error(e);
  }
};
