let scoreObj;

//演奏
const onMidi = (obj) => {
    if (ABCJS.synth.supportsAudio()) {
        const visualObj = ABCJS.renderAbc("notation", obj)[0];
        const synthControl = new ABCJS.synth.SynthController();
        synthControl.load("#audio", null, {
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
        });
        synthControl.setTune(visualObj, false);
    } else {
        $("#audio").html("<div class='audio-error'>ERROR!</div>")
    }
}

//記譜
const onRender = (tune, params) => {
    scoreObj = $("#score").val();
    if (!params) params = {};
    ABCJS.renderAbc("notation", tune, params);
    $("#audio").html("");

    onMidi(scoreObj)
}

//テキストファイルをダウンロード
window.addEventListener('load', () => {
    $('#save').on('click', (evt) => {
        evt.preventDefault();
        scoreObj = $("#score").val();
        const blob = new Blob([scoreObj], { type: 'text/plain' }); //{endings:'native'}は不要？
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = `${toLocaleString(new Date)}.txt`;
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    })

    const toLocaleString = (date) => {
        return [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
        ].join('')
    }
})

//ファイル選択後の処理
$("#selfile").change((evt) => {
    const file = evt.target.files;
    //FileReaderの作成
    const reader = new FileReader();
    //テキスト形式で読み込む
    reader.readAsText(file[0]);
    //読込終了後の処理
    reader.onload = function (ev) {
        //テキストエリアに表示する
        $('#score').val(reader.result);
    }
});

const combination = (nums, k) => {
    let ans = [];
    if (nums.length < k) {
        return []
    }
    if (k === 1) {
        for (let i = 0; i < nums.length; i++) {
            ans[i] = [nums[i]];
        }
    } else {
        for (let i = 0; i < nums.length - k + 1; i++) {
            let row = combination(nums.slice(i + 1), k - 1);
            for (let j = 0; j < row.length; j++) {
                ans.push([nums[i]].concat(row[j]));
            }
        }
    }
    return ans;
}

const Guitar = class {
    constructor() {
        //各弦に音セット
        const string1 = document.querySelectorAll(".string1 input");
        const eSoundSet = ["e", "f", "^f", "g", "^g", "a", "^a", "b", "c'", "^c'", "d'", "^d'"];
        this.setSound(string1, eSoundSet);
        const string2 = document.querySelectorAll(".string2 input");
        const bSoundSet = ["B", "c", "^c", "d", "^d", "e", "f", "^f", "g", "^g", "a", "^a"];
        this.setSound(string2, bSoundSet);
        const string3 = document.querySelectorAll(".string3 input");
        const gSoundSet = ["G", "^G", "A", "^A", "B", "c", "^c", "d", "^d", "e", "f", "^f"];
        this.setSound(string3, gSoundSet);
        const string4 = document.querySelectorAll(".string4 input");
        const dSoundSet = ["D", "^D", "E", "F", "^F", "G", "^G", "A", "^A", "B", "c", "^c"];
        this.setSound(string4, dSoundSet);
        const string5 = document.querySelectorAll(".string5 input");
        const aSoundSet = ["A,", "^A,", "B,", "C", "^C", "D", "^D", "E", "F", "^F", "G", "^G"];
        this.setSound(string5, aSoundSet);
        const string6 = document.querySelectorAll(".string6 input");
        const ESoundSet = ["E,", "F,", "^F,", "G,", "^G,", "A,", "^A,", "B,", "C", "^C", "D", "^D"];
        this.setSound(string6, ESoundSet);
    }

    setSound = (stringSound, soundSet) => {
        soundSet.map((sound, i) => {
            // const d = document.createElement("span");
            // d.setAttribute(stringSound.className, i);
            stringSound[i].name = sound;

        });
    }
}

const gt = new Guitar

$(".btn").on("click", function () {
    //アロー関数にすると何故かthis=windowになる

    //ABC譜に追記
    $('#score').val(`${$('#score').val()}${$(this).attr('name')}`)
})

$('#add').on("click", () => {
    //コードをABC譜に追記
    $('#score').val(`${$('#score').val()}"${$('#chord').val()}"`)
})

$("#end").on("click", () => {
    //ABC譜に追記
    $('#score').val(`${$('#score').val()}|`)
})

$("#abc").on("click", () => {
    alert('基本音符長の単位が８分音符（L：1/8）の場合、\n全音符：C8、付点2分音符：C6、2分音符：C4、付点4分音符：C3、\n4分音符：C2、8分音符：C、16分音符：C/\n3連符：音階の前に(3、和音：[]で囲む')
})

