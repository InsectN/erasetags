
class OneProcess {
    constructor(process) {
        this.label      = process.label;
        this.goto       = process.goto;
        this.category   = process.category;
        this.method     = process.method;
        this.property   = process.property;
        this.under      = process.under;
    }
}

async function set_storage(setting_json) {
    //@ts-ignore
    await chrome.storage.local.set({"setting": setting_json});
}
async function get_storage() {

    let setting = JSON.parse(JSON.stringify(await chrome.storage.local.get("setting"))).setting;
    if(setting === undefined) {
        return {
                outputLog: false,
                action: []
            }
    } else {
        return setting;
    }
}

function is_safe_one_action_json(json) {
    if( json.title      !== undefined &&
        json.enabled    !== undefined &&
        json.url        !== undefined)
        return true;
    return false;
}