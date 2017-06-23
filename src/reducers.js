import {combineReducers} from 'redux';
import { reducer as bayesReducer } from 'bayes-classifier';
import { 
    UPDATE_RECIPES,
    UPDATE_APP_VERSION,
    APP_VERSION,
    MAIN_TAB,
    ADD_SERVER,
    UI_REQUEST_ACTIVE_URL,
    UI_SHOW_ADD_RECIPE,
    REQUEST_ACTIVE_TAB_TEXT,
    SET_CONTENT,
    APPLY_CORPUS,
    APPLY_CORPORA,
    CHANGE_CLASSIFICATION,
    ADD_CORPUS,
    ADD_CLASSIFICATION,
    ADD_CLASSIFICATION_URL,
    REMOVE_CLASSIFICATION_URL,
    ADD_CORPUS_CLASSIFICATION,
    ACTIVE_URL,
    LOAD_RECIPE,
    ADD_RECIPE,
    REMOVE_RECIPE,
    UPDATE_RECIPE,
    UI_LOAD_RECIPE,
    APPLY_RESTORED_STATE
} from './constants';
import { reducer as formReducer } from 'redux-form';

const initialState = {
    url: '',
    content: '',
    version: '_NA_',
    classifierStatus: '',
    currentClassification: '',
    classifiers: {
        'BAYES': { name: 'Naive Bayesian' }
    },
    sources: {
        'DEFAULT': { name: 'Current page' }
    },
    sinks: {
        'DEFAULT': { name: 'Extension drop-down' }
    },
    servers: [],
    currentServer: '',
    classifications: [],
    corpora: {},
    recipes: {},
    addRecipeDialogOpen: false,
    repositories: [],
    ui: {
        classification: ''
    }
}

function classifications(state = initialState.classifications, action) {
//    console.log('REDUCER', action)
    return state;
}

const corpora = (state = initialState.corpora, action) => {
    let newState = {...state}
    switch (action.type) {
        case ADD_CORPUS:
            newState[action.corpus] = {
                corpus: action.corpus,
                classifications: action.classifications ? action.classifications : {}
            }
            return newState
        case APPLY_CORPUS:
            newState[action.corpus.url] = action.corpus
            return newState
        case APPLY_CORPORA:
            return action.corpora
        case ADD_CLASSIFICATION:
            newState[action.corpus].classifications[action.classification] = []
            return newState
        case ADD_CLASSIFICATION_URL:
            newState[action.corpus].classifications[action.classification].push(action.url)
            return newState
        case REMOVE_CLASSIFICATION_URL:
            let cArray = newState[action.corpus].classifications[action.classification]
            if (cArray.includes(action.url)) {
                cArray.splice(cArray.indexOf(action.url),1)
            }
            return newState
        case APPLY_RESTORED_STATE:
            return action.state.corpora ? action.state.corpora : state
        default:
            return state
    }
}

function content(state = initialState.content, action) {
    switch (action.type) {
        default:
            return state
    }

    return state;
}

function urls(state = initialState.url, action) {
    switch (action.type) {
        case ACTIVE_URL:
            return (action.url != undefined) ? action.url : state
        default:
            return state
    }
}

function classify(state = initialState.currentClassification, action) {
    switch (action.type) {
        case CHANGE_CLASSIFICATION:
            return action.classification
        default:
            return state
    }
}

function ui(state = initialState.ui, action) {
    return state;
}

const recipes = (state = initialState.recipes, action) => {
    let newState = {...state}
    switch (action.type) {
        case ADD_RECIPE:
            newState[action.recipe] = {
                recipe: action.recipe,
                source: 'DEFAULT',
                sink: 'DEFAULT',
                classifier: 'BAYES',
            }
            return newState
        case UPDATE_RECIPE:
            newState[action.recipe] = {
                recipe: action.recipe,
                source: action.source,
                sink: action.sink,
                classifier: action.classifier,
                corpus: action.corpus,
            }
            return newState
        case REMOVE_RECIPE:
            delete newState[action.recipe]
            return newState
        case APPLY_RESTORED_STATE:
            return action.state.recipes ? action.state.recipes : state
        default:
            return state
    }
}

const tabs = (state = 0, action) => {
    switch (action.type) {
        case MAIN_TAB:
            return action.index
        default:
            return state
    }
}

const servers = (state = initialState.servers, action) => {
    switch (action.type) {
        case UPDATE_RECIPES:
            let newState = [...state]
            newState = newState.map(server => {
                server.recipes = (server.url == action.url) ? server.recipes : action.recipes
                return server
            })
            return newState
        case LOAD_RECIPE:
            return state.map(server => {
                return (server.url == action.server.url) ?
                {
                    ...server,
                    recipes: server.recipes.map(recipe => {
                        return (recipe.name == action.recipe.name) ? {...recipe, load: action.load} : recipe
                    })
                } :
                server
            })
        case APPLY_RESTORED_STATE:
            return action.state.servers ? action.state.servers : state
        case ADD_SERVER:
            return [...state, { url: action.server, recipes: [], status: '' }]
        default:
            return state
    }
}

const currentServer = (state = initialState.currentServer, action) => {
    switch (action.type) {
        case APPLY_RESTORED_STATE:
            return action.state.currentServer ? action.state.currentServer : state
        default:
            return state
    }
}

const addRecipeDialogOpen = (state = initialState.addRecipeDialogOpen, action) => {
    switch (action.type) {
        case UI_SHOW_ADD_RECIPE:
            return action.visible
        default:
            return state
    }
}

const version = (state = initialState.version, action) => {
    switch (action.type) {
        case UPDATE_APP_VERSION:
            return action.version
        case APPLY_RESTORED_STATE:
            return action.state.version ? action.state.version : state
        default:
            return state
    }
}

const sinks = (state = initialState.sinks, action) => {
    return state
}

const sources = (state = initialState.sources, action) => {
    return state
}

const classifiers = (state = initialState.classifiers, action) => {
    return state
}

export default combineReducers({
    url: urls,
    servers: servers,
    recipes: recipes,
    corpora: corpora,
    version: version,
    sinks: sinks,
    sources: sources,
    classifiers: classifiers,
    addRecipeDialogOpen: addRecipeDialogOpen,
    currentServer: currentServer,
    currentClassification: classify,
    classifications: classifications,
    content: content,
    form: formReducer,
    mainTab: tabs,
    ui: ui
});
