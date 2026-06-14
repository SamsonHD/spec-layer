/// <reference types="react/canary" />

import { cache } from "react";
import {
  getAllDocs as readAllDocs,
  getNavTree as readNavTree,
} from "./content";

export const getAllDocs = cache(readAllDocs);
export const getNavTree = cache(() => readNavTree(getAllDocs()));
