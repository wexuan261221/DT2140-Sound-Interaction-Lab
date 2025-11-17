//==========================================================================================
// AUDIO SETUP
//==========================================================================================
let dspNode = null;
let dspNodeParams = null;
let jsonParams = null;

// Name must match wasm/js prefix — all lowercase in your case
const dspName = "churchbell";
const instance = new FaustWasm2ScriptProcessor(dspName);

// Export for browser
if (typeof module === "undefined") {
    window[dspName] = instance;
} else {
    const exp = {};
    exp[dspName] = instance;
    module.exports = exp;
}

// Load the DSP — must match your lowercase module name
churchbell.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);

        console.log("params:", dspNode.getParams());
        const jsonString = dspNode.getJSON();
        jsonParams = JSON.parse(jsonString)["ui"][0]["items"];
        dspNodeParams = jsonParams;
    });


//==========================================================================================
// INTERACTIONS
//==========================================================================================

function accelerationChange(accx, accy, accz) {}

function rotationChange(rotx, roty, rotz) {}

function mousePressed() {
    playAudio();
}

function deviceMoved() {
    movetimer = millis();
    statusLabels[2].style("color", "pink");
}

function deviceTurned() {
    threshVals[1] = turnAxis;
}

function deviceShaken() {
    shaketimer = millis();
    statusLabels[0].style("color", "pink");
    playAudio();   // shake → bell
}

function getMinMaxParam(address) {
    const p = findByAddress(dspNodeParams, address);
    const [mn, mx] = getParamMinMax(p);
    console.log("Min:", mn, "Max:", mx);
    return [mn, mx];
}


//==========================================================================================
// AUDIO INTERACTION
//==========================================================================================

function playAudio() {
    if (!dspNode) return;
    if (audioContext.state === "suspended") return;

    // IMPORTANT:
    // check console.log(params) to confirm exact parameter path
    // likely: "/churchbell/gate"
    dspNode.setParamValue("/churchbell/gate", 1);

    setTimeout(() => {
        dspNode.setParamValue("/churchbell/gate", 0);
    }, 120);
}

//==========================================================================================
// END
//==========================================================================================