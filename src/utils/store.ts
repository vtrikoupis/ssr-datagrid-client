import { createStore, createTypedHooks} from 'easy-peasy';
import model, { StoreModel } from "./model";

/**
 * @typedef State
 * @type {{data: Array<Objects>}}
 */

const { useStoreState, useStoreActions, useStore } = createTypedHooks<StoreModel>();
export { useStoreState, useStoreActions, useStore };

const store = createStore(model);

export default store