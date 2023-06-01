#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";
import { printError, printSuccess, printHelp } from "./services/log-service.js";
import { getWeather } from "./services/api-service.js";
import dotenv from "dotenv";

dotenv.config();

// const saveToken = async (token) => {
//   if (!token.length) {
//     printError(`Token has not been passed`);
//     return;
//   }
//   try {
//     await saveToStorage(TOKEN_DICTIONARY.token, token);
//     printSuccess("Token saved successfully");
//   } catch (error) {
//     printError(`Token did not save. Error: ${error.message}`);
//   }
// };

const getForecast = async () => {
  try {
    const weather = await getWeather(process.env.CITY || "Moscow");
    return weather;
  } catch (error) {
    if (error?.response?.status === 404) {
      printError("Wrong city or other request params");
    } else if (error?.response?.status === 401) {
      printError("Invalid API");
    } else {
      printError(error.message);
    }
  }
};

const initCLI = async () => {
  const args = getArgs(process.argv);
  if (args.h) {
    printHelp();
  }
  if (args.s) {
    console.log("Save city");
  }
  if (args.t) {
    saveToken(args.t);
  }

  console.log(await getForecast());
};

initCLI();
