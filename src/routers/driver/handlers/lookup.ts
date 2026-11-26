/*
 * Copyright © 2026 Metreeca srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Retrieval handler.
 *
 * @module
 */

import { validate } from "@grafctory/blue";
import type { ResourceShape } from "@grafctory/blue/resource";
import { isFunction, type Lazy, type Optional } from "@grafctory/core";
import { isTag, type Tag } from "@grafctory/core/language";
import { NotFound, OK } from "@grafctory/http";
import type { Template } from "@grafctory/qest/model";
import { encodeResource, type Resource } from "@grafctory/qest/state";
import type { Request, RequestHandler } from "express";
import { query } from "../model/parse.js";
import { populate } from "../model/populate.js";
import { base, checked, decoding, handler, scope, storage, target } from "./index.js";


/**
 * Serves `GET` requests on a resource.
 *
 * Retrieves the resource the request addresses with the template its query component states, decoded and populated
 * within the bounds of the server template and `scope`, or with the expanded server template if the query is empty.
 * Localised content is negotiated through the `Accept-Language` header, as `@grafctory/qest` prescribes. The server
 * `locale` serves requests accepting any language or stating no such header. Values tagged with no language are
 * served as a last resort, whatever the header states, so that no request misses language-neutral content.
 *
 * Every response is marked as varying by `Accept-Language`, so that HTTP caches keep each language apart.
 *
 * - `200 OK` with the resource as JSON
 * - `404 Not Found` where the store holds no such resource and the lookup is not `virtual`, or `review` withholds it
 *
 * @param opts Handler options
 * @param opts.shape The shape of the resource each request addresses, possibly deferred to break definition cycles
 * @param opts.virtual Whether the resource is derived from the store rather than held in it. A virtual resource is
 *     served even if the store holds no such entry, and its collections list every resource of their range class
 * @param opts.model The server template fixing the entries it states and the collection views clients filter
 *     within; if omitted, the shape alone describes what clients may retrieve, hidden members included. Stated as a
 *     function, the template is computed for each request, so that the view served may depend on the caller
 * @param opts.review Reviews the retrieved resource before it is served, returning the resource to send, or
 *     `undefined` to answer `404 Not Found` as if the store held no such resource, as when the caller may not see it
 *
 * @returns A handler retrieving the resource each request addresses
 */
export function lookup({ shape, virtual, model, review }: {

	readonly shape: Lazy<ResourceShape>
	readonly virtual?: boolean
	readonly model?: Template | ((request: Request) => Template)
	readonly review?: (match: Resource, request: Request) => Optional<Resource> | Promise<Optional<Resource>>

}): RequestHandler {

	return handler(async (request, response) => {

		response.vary("Accept-Language");

		const $scope = scope(request);

		const entry = target(request);
		const client = decoding(() => query(shape, new URL(request.originalUrl, entry).search.slice(1), { base: entry }));
		const template = checked(validate<Template>(populate(shape, client, isFunction(model) ? model(request) : model), {
			shape,
			model: true,
			...$scope
		}));
		const match = await storage(request).lookup({ entry, shape, model: template, virtual }, {
			...$scope,
			locale: negotiate(request.acceptsLanguages(), $scope.locale ?? [])
		});

		const payload = match === undefined || review === undefined ? match : await review(match, request);

		payload === undefined
			? response.status(NotFound).end()
			: response.status(OK).type("json").send(encodeResource(payload, { base: base(request) }));

	});

}


/**
 * Derives the language priority for a request as `@grafctory/qest` prescribes.
 *
 * @param ranges The accepted language ranges, ordered by preference with unacceptable ones left out
 * @param fallback The languages standing in for the `*` wildcard
 *
 * @returns The deduplicated priority list, ending with the language-neutral `und` tag
 */
function negotiate(ranges: readonly string[], fallback: readonly Tag[]): readonly Tag[] {

	return [...new Set([...ranges.flatMap(range => range === "*" ? fallback : reduce(range)), "und"])];

}

/**
 * Reduces a language range to its tag at language-and-script granularity, or to none where it is malformed.
 */
function reduce(range: string): readonly Tag[] {

	const tag = range.replace(/^([^-]+)-\*$/, "$1");
	const [language = "", script = ""] = tag.split("-");

	return isTag(tag) ? [/^[a-z]{4}$/i.test(script) ? `${language}-${script}` : language] : [];

}
