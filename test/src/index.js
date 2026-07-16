import utils from "#utils/utils.js";




export default function index() {
    console.log(name);
}

index();

function fibonacci(n) {
    if (n < 0) throw new Error("n debe ser >= 0");
    if (n <= 1) return n;

    let a = 0;
    let b = 1;

    for (let i = 2; i <= n; i++) {
        const c = a + b;
        a = b;
        b = c;
    }

    return b;
}

console.log(fibonacci(10)); // 55

export const div = /*html*/`
<div class="controls">
    <label>
        <span class="title">Team count</span>
        <input type="range" value="3" step="1" min="1" max="8" name="team-count">
        <span class="value">8</span>
    </label>
    <label>
        <span class="title">Inner radius</span>
        <input type="range" value="0.2" step="0.1" min="0" max="1" name="inner-radius">
        <span class="value">0.2</span>
    </label>
    <label>
        <span class="title">Outer radius</span>
        <input type="range" value="0.9" step="0.1" min="0" max="1" name="outer-radius">
        <span class="value">0.9</span>
    </label>
    <label>
        <span class="title">Gap angle</span>
        <input type="range" value="0" step="1" min="0" max="180" name="gap-angle">
        <span class="value">0</span>
    </label>
    <label>
        <span class="title">Start angle</span>
        <input type="range" value="0" step="1" min="0" max="360" name="start-angle">
        <span class="value">0</span>
    </label>

    <style>
        .controls{
            display: flex;
            flex-direction: column;
            gap: 1em;
        }

        .controls label{
            display: grid;
            grid-template-columns: min-content min-content min-content;
            gap: 1em;
            align-items: center;
        }

    </style>
</div>
`

export const svg = /*svg*/`
<svg width="500" height="500">
    <circle cx="250" cy="250" r="200" stroke="black" stroke-width="3" fill="none" />
</svg>
`


export const css = /*css*/`
.controls{
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.controls label{
    display: grid;
    grid-template-columns: min-content min-content min-content;
    gap: 1em;
    align-items: center;
}

.controls label .title{
    text-align: right;
}

.controls label .value{
    text-align: right;
    width: 3em;
}

.controls label input{
    min-width: 250px;
}`