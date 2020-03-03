import { Observable } from "rxjs";
import {
  ICollectionQueryBuilder,
  QueryFn
} from "../interfaces/ICollectionQueryBuilder";
import { QueryState } from "./QueryState";
import {
  CollectionCommandAdd,
  CollectionCommandAddMany,
  CollectionCommandDeleteId,
  CollectionCommandDeleteIds,
  CollectionCommandUpdate,
  CollectionCommandUpdateMany
} from "./CollectionCommandBuilders";
import {
  CollectionQueryGetAllDocs,
  CollectionQueryGetId,
  CollectionQueryGetManyIds,
  CollectionQueryGetAllDocsForce
} from "./CollectionQueryBuilders";
import { DocWithId } from "../interfaces/DocWithId";
import { FirebaseClientStateObject } from "../../FirebaseClientStateObject";
import { ActionFunction } from "../interfaces/Actions";

export class CollectionQueryBuilder<
  TState extends FirebaseClientStateObject,
  Colls,
  Docs
> implements ICollectionQueryBuilder<TState, Colls, Docs> {
  private callbacks: ActionFunction<Colls, Docs>[] = [];

  constructor(private queryState: QueryState<TState>) {}

  GetAllDocs<T>(whereQuery?: QueryFn): Observable<T[]> {
    return CollectionQueryGetAllDocs<T>(this.queryState, whereQuery);
  }
  GetAllDocsForce<T>(whereQuery?: QueryFn): Observable<T[]> {
    return CollectionQueryGetAllDocsForce<T>(this.queryState, whereQuery);
  }
  GetId<T>(id: string): Observable<T> {
    return CollectionQueryGetId<T>(this.queryState, id);
  }
  GetManyIds<T>(ids: string[]): Observable<T[]> {
    return CollectionQueryGetManyIds<T>(this.queryState, ids);
  }
  UpdateMany(objs: DocWithId[], isMerged?: boolean) {
    return CollectionCommandUpdateMany(this.queryState, objs, isMerged);
  }
  Update<T>(id: string, obj: T, merge?: true): Promise<void> {
    return CollectionCommandUpdate(this.queryState, id, obj, merge);
  }
  Add<T>(obj: T): Promise<firebase.firestore.DocumentReference> {
    return CollectionCommandAdd<T>(this.queryState, obj);
  }
  AddMany(objs: {}[]) {
    return CollectionCommandAddMany(this.queryState, objs);
  }
  DeleteId(id: string) {
    return CollectionCommandDeleteId(this.queryState, id);
  }
  DeleteIds(ids: string[]) {
    return CollectionCommandDeleteIds(this.queryState, ids);
  }
  FromSubCollection<T>(
    id: string,
    subcollection: string
  ): ICollectionQueryBuilder<TState, Colls, Docs> {
    this.queryState.SetSubCollection(id, subcollection);
    return this;
  }
  AfterActionCall(
    callback: ActionFunction<Colls, Docs>
  ): ICollectionQueryBuilder<TState, Colls, Docs> {
    this.callbacks.push(callback);
    return this;
  }
  OverrideAppState(
    overridenState: TState
  ): ICollectionQueryBuilder<TState, Colls, Docs> {
    this.queryState.OverrideAppState(overridenState);
    return this;
  }
  ref(): Observable<firebase.firestore.CollectionReference> {
    return this.queryState.refCollection();
  }
}
