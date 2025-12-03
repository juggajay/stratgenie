/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_documentEmail from "../actions/documentEmail.js";
import type * as actions_documents from "../actions/documents.js";
import type * as actions_email from "../actions/email.js";
import type * as actions_embeddings from "../actions/embeddings.js";
import type * as actions_guardian from "../actions/guardian.js";
import type * as actions_levyEmail from "../actions/levyEmail.js";
import type * as actions_openai from "../actions/openai.js";
import type * as compliance from "../compliance.js";
import type * as documents from "../documents.js";
import type * as finance from "../finance.js";
import type * as guardian from "../guardian.js";
import type * as levies from "../levies.js";
import type * as leviesInternal from "../leviesInternal.js";
import type * as lib_financialMath from "../lib/financialMath.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as lots from "../lots.js";
import type * as schemes from "../schemes.js";
import type * as templates_agm_notice from "../templates/agm_notice.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/documentEmail": typeof actions_documentEmail;
  "actions/documents": typeof actions_documents;
  "actions/email": typeof actions_email;
  "actions/embeddings": typeof actions_embeddings;
  "actions/guardian": typeof actions_guardian;
  "actions/levyEmail": typeof actions_levyEmail;
  "actions/openai": typeof actions_openai;
  compliance: typeof compliance;
  documents: typeof documents;
  finance: typeof finance;
  guardian: typeof guardian;
  levies: typeof levies;
  leviesInternal: typeof leviesInternal;
  "lib/financialMath": typeof lib_financialMath;
  "lib/permissions": typeof lib_permissions;
  lots: typeof lots;
  schemes: typeof schemes;
  "templates/agm_notice": typeof templates_agm_notice;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
