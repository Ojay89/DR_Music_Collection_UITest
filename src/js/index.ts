import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface IMusic {
    id : Number;
    title : String;
    artist : String;
    album : String;
    recordLabel : String;
    durationInSeconds: Number;
    yearOfPublication: Number;
}

let baseUri: string ="https://restmusicserviceoo.azurewebsites.net/api/Music"
let outputElement : HTMLDivElement= <HTMLDivElement> document.getElementById("output");
let buttonElement : HTMLButtonElement = <HTMLButtonElement> document.getElementById("getAllButton");
buttonElement.addEventListener("click",ShowRecords);

function ShowRecords(): void {
    axios.get<IMusic[]>(baseUri)
    .then(function(response: AxiosResponse<IMusic[]>): void {

        // Virker fint, men ser grimt ud
        // let result: string ="<ul id='MusicList' class='list-group' >";
        // response.data.forEach((music: IMusic) => {
        //     result += "<li style='margin: 5px; background: lightgrey;' class='list-group-item'>" + "<b>ID: </b>" + music.id + " " + "<br><b>Title: </b>" + "<i>" + music.title + "</i>" + " " +  "<br><b>Artist: </b>" + music.artist + " " + "<br><b>Album: </b>" + music.album + " " + "<br><b>Record Label: </b>" + music.recordLabel + " " + "<br><b>Duration in Seconds: </b>" + music.durationInSeconds + " " + "<br><b>Year of Publication: </b>" + music.yearOfPublication + " " + "<br></li>";
        // });
        // result += "</ul>";
        // outputElement.innerHTML = result;
        let langHTML = json2table(response.data)
        console.log(langHTML);
        outputElement.innerHTML = langHTML;

    })

    .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
        if (error.response) {
            // the request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
            outputElement.innerHTML = error.message;
        } else { // something went wrong in the .then block?
            outputElement.innerHTML = error.message;
        }
    });
}

export function json2table(json: any): string {
    let cols: string[] = Object.keys(json[0]);
    let headerRow: string = "";
    let bodyRows: string = "";
    cols.forEach((colName: string) => {
        headerRow += "<th>" + capitalizeFirstLetter(colName) + "</th>"
    });
    json.forEach((row: any) => {
        bodyRows += "<tr>";
        // loop over object properties and create cells
        cols.forEach((colName: string) => {
            bodyRows += "<td>" + (typeof row[colName] === "object" ? JSON.stringify(row[colName]) : row[colName]) + "</td>";
        });
        bodyRows += "</tr>";
    });
    return "<table><thead><tr>" +
        headerRow +
        "</tr></thead><tbody id='MusicList' style='margin-left: 100px;'>" +
        bodyRows +
        "</tbody></table>";
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}