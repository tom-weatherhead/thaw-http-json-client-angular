// thaw-http-json-client-angular/src/main.ts

import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders // , HttpResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IHttpJsonClient, IHttpJsonClientError } from 'thaw-types';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
		// , 'Authorization': 'my-auth-token'
	})
};

class HttpJsonClient implements IHttpJsonClient {
	constructor(private http: HttpClient) {}

	public get<T>(url: string): Observable<T> {
		return this.f('GET', url, () => this.http.get<T>(url))();
	}

	// public getHttpResponse<T>(url: string): Observable<HttpResponse<T>> {
	// 	return this.f('GET', url, () =>
	// 		this.http.get<T>(url, { observe: 'response' })
	// 	)();
	// }

	public post(url: string, body: unknown): Observable<unknown> {
		return this.f('POST', url, () =>
			this.http.post(url, body, httpOptions)
		)();
	}

	public put(url: string, body: unknown): Observable<unknown> {
		return this.f('PUT', url, () =>
			this.http.put(url, body, httpOptions)
		)();
	}

	public patch(url: string, body: unknown): Observable<unknown> {
		return this.f('PATCH', url, () =>
			this.http.patch(url, body, httpOptions)
		)();
	}

	public delete<T>(url: string): Observable<T> {
		return this.f('DELETE', url, () => this.http.delete<T>(url))();
	}

	public head<T>(url: string): Observable<T> {
		return this.f('HEAD', url, () => this.http.head<T>(url))();
	}

	public options<T>(url: string): Observable<T> {
		return this.f('OPTIONS', url, () => this.http.options<T>(url))();
	}

	private f<T>(
		method: string,
		url: string,
		g: () => Observable<T>
	): () => Observable<T> {
		return () =>
			g().pipe(
				// retry(3), // retry a failed request up to 3 times
				catchError((error: HttpErrorResponse) =>
					this.handleError(method, url, error)
				)
			);
	}

	// public makeIntentionalError() {
	// 	return this.get('not/a/real/url');

	// 	// const url = 'not/a/real/url';

	// 	// return this.http.get(url)
	// 	// 	.pipe(
	// 	// 		// catchError(this.handleError)
	// 	// 		catchError((error: HttpErrorResponse) => this.handleError('GET', url, error))
	// 	// 	);
	// }

	private handleError(
		httpMethod: string,
		url: string,
		error: HttpErrorResponse
	): Observable<never> {
		console.error('handleError() : error is', error);

		// if (!error || error.ok !== false) {
		if (!error) {
			// return throwError({
			// 	error: {error}, // Angular lint seems to prefer this to: error: error,
			// 	message: 'Default: Error caught in HttpJsonClientService.handleError()'
			// });

			// return throwError(new HttpJsonClientError());
			return throwError({} as IHttpJsonClientError);
		}

		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error(
				'instanceof ErrorEvent. An error occurred:',
				error.error.message
			);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Not instanceof ErrorEvent. Backend returned code ${error.status}, body was:`,
				error.error
			);
		}

		// // return an ErrorObservable with a user-facing error message
		// // return new ErrorObservable('Something bad happened; please try again later.');
		// return throwError('Something bad happened; please try again later.');

		console.error(
			`${httpMethod} ${url} status: ${error.status} ${error.statusText}`
		);

		return throwError({
			ok: typeof error.ok === 'boolean' ? error.ok : undefined,
			status:
				parseInt(error.status.toString(), 10) === error.status &&
				!Number.isNaN(error.status)
					? error.status
					: undefined,
			statusText: error.statusText || undefined,
			message: error.message || undefined,
			url: error.url || undefined
		} as IHttpJsonClientError);
	}
}

export function createHttpJsonClient(http: HttpClient): IHttpJsonClient {
	return new HttpJsonClient(http);
}
