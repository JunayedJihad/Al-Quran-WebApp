let container = document.getElementById("container");

let audioAyats = [];
let ayatNo = [];

document.getElementById("close").addEventListener("click", () => {
  document.getElementById("warning").remove();
});

function stopAudio() {
  document.getElementById("audio").pause();
}

function bringModal(number) {
  document.getElementById(
    "staticBackdropLabel"
  ).innerHTML = `Ayat no ${number}`;
  document.getElementById("audio").src = audioAyats[number - 1];
}

async function bringSura(no) {
  let ayatInfo = "";

  audioAyats = [];
  ayatNo = [];

  let suraLink = `https://api.quran.gading.dev/surah/${no}`;
  let suraResponse = await fetch(suraLink);
  suraResponse = await suraResponse.json();

  let suraInfo = `
       <div class="card suraInfo" ondblclick="bringSuraList()">
              <h4>${suraResponse.data.name.long}</h4>
              <h5>${suraResponse.data.name.transliteration.en}</h5>
              <h6>${suraResponse.data.name.translation.en}</h6>
              <div class="ayat-source">

                  <span>Ayat-${suraResponse.data.numberOfVerses}</span>
                  <span>${suraResponse.data.revelation.id}</span>
              </div>

          </div>

      `;

  suraResponse.data.verses.forEach((verse) => {
    audioAyats.push(verse.audio.primary);
    ayatNo.push(verse.number.inSurah);

    if (verse.meta.sajda.recommended || verse.meta.sajda.obligatory) {
      let sajda = "Sajda";

      ayatInfo += `
              <div class="card suraCard" ondblclick="bringSuraList()">
              <div class="ayat">
                  <span>${verse.number.inSurah}</span>
                  <span title="Play" onclick="bringModal(${verse.number.inSurah})" class="icon" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa-solid fa-circle-play"></i></span>
              </div>
              <div class="arabic">${verse.text.arab}
              <span class="sajda p-1 text-bg-warning">${sajda}</span>
              </div>
              <div class="transliteration">${verse.text.transliteration.en}</div>
              <div class="meaning">${verse.translation.en}</div>
          </div>

          `;
    } else {
      ayatInfo += `
              <div class="card suraCard" ondblclick="bringSuraList()">
              <div class="ayat">
                  <span>${verse.number.inSurah}</span>
                  <span title="Play" onclick="bringModal(${verse.number.inSurah})" class="icon" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa-solid fa-circle-play"></i></span>
              </div>
              <div class="arabic">${verse.text.arab}
              </div>
              <div class="transliteration">${verse.text.transliteration.en}</div>
              <div class="meaning">${verse.translation.en}</div>
          </div>

          `;
    }
  });
  container.innerHTML = `
        ${suraInfo}
        ${ayatInfo}
        `;
}

let bringSuraList = async () => {
  try {
    let response = await fetch("https://api.quran.gading.dev/surah");
    response = await response.json();

    let suraList = "";
    response.data.map((eachData) => {
      suraList += `
                <div class="card" onclick="bringSura(${eachData.number})" ondblclick="bringSura(${eachData.number})" id="${eachData.number}">
                <div class="card-left">
                    <div class="no">${eachData.number}</div>
                    <div class="info">
                        <h5>${eachData.name.transliteration.en}</h5>
                        <p>Ayat-${eachData.numberOfVerses}</p>
                    </div>
                </div>
                <div class="card-right">
                    <h4>${eachData.name.short}</h4>
                </div>
            </div>
            `;
    });

    container.innerHTML = suraList;
  } catch {
    alert("Something went wrong");
    throw new Error("Something went wrong!");
  }
};
bringSuraList();
