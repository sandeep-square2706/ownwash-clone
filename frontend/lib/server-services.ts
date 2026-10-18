import "server-only";

import { cache } from "react";

import { loadServiceBySlug, loadServices } from "@/lib/services";

export const loadServerServices = cache(loadServices);
export const loadServerServiceBySlug = cache(loadServiceBySlug);
