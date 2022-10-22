<script setup>
//Import des éléments de vue
import { ref, reactive, onMounted } from "vue";

//import d'un type de graphique de type barchart
import { Bar } from "vue-chartjs";

//Import des objets du graphique de la bibliothèque ChartJs
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

//Eléments utilisés par le graphique
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

//Propriétés du graphique utilisées dans le template
//On définit pour chacune son type de données et sa valeur par défaut
//On peut utiliser une grande variété de type, voire des objets
const propChart = defineProps({
  chartId: { type: String, default: "bar-chart" }, //id du graphique
  datasetIdKey: { type: String, default: "label" }, //id du dataSet
  width: { type: Number, default: "300" }, //largeur du graphique
  height: { type: Number, default: "300" }, //Hauteur du graphique
  cssClasses: { type: String, default: "" }, //Classes ccs utilisées
  styles: { type: Object, default: () => {} }, //styles ccs utilisée
  plugins: { type: Object, default: () => {} }, //plugins utilisés
});

//Doonées injectées dans le graphique
let chartData = reactive({
  //Etiquette de l'axe
  labels: [],
  //Valeurs des données du graphique
  datasets: [
    {
      //Valeurs des données
      data: [],
      // Couleur des barres en regard des valeurs
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(60, 170, 240, 0.2)",
      ],
      // Couleur de la bordure de chaque barre
      borderColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(60, 170, 240)",
      ],
      borderWidth: 1,
    },
  ],
});

//Options du graphique
//Les principales utilisées, il en existe d'autres
//Voir documentation
let chartOptions = reactive({
  //Aspect responsive du graphique
  reponsive: true,
  //Maintien du ratio
  maintainAspectRation: false,

  //Type de projetction utilisée
  // x : verticale
  // y: horizontale
  indexAxis: "x",

  //Echelles du graphique
  scales: {
    //axe des ordonnées
    y: {
      // Valeur max des y
      suggestedMax: 100,
      ticks: {
        //Police
        font: {
          size: 16,
        },
      },
    },
    //axe des abscisses
    x: {
      // Valeur max des y
      ticks: {
        //Police
        font: {
          size: 16,
        },
      },
    },
  },

  //Les plugins
  plugins: {
    //Légende des données
    legend: {
      //label des données
      labels: {
        color: "blue",
        font: {
          size: 16,
        },
      },
    },
    title: {
      //Affichage du titre
      display: true,
      //Libellé du graphique
      text: "Chartjs - Barchart",
      //Couleur du texte
      color: "blue",
      //Police du texte
      font: {
        size: 16,
      },
    },
  },
});

let liste = ref(null);
    //Liste des oui non
    //table nb de villageois par spécialité
    let lstNb = [];
    //Au montage du composant
    onMounted(async() => {
            //let request = "https://accidentvelo.jmfino.fr/json.php"
            let request = "accidents-velos.json"
        await fetch(request)
        //Réponse demandée en json
        .then(response => response.json())
        //Récupération de la réponse
        .then(response => {
            liste.value = response
        console.log("liste", liste)
            })
            .catch(error => console.log('erreur Ajax', error))

            let setRoutes = new Set()
            let firstLine = true;
            liste.value.forEach( (el) => {
                if(!firstLine){
                    let dt = el[11] //Recupération de l'année à partir de la date
                    setRoutes.add(dt[0]) //Ajout année au set
                }
                firstLine = false
            })
            //Chargement des labels
            chartData.labels = Array.from(setRoutes)
            chartData.labels.sort() //Tri des années
            


            
            //Recupération des valeurs de set dans un tableau
            //chartData.labels = Array.from(setOuiNon);
            //Tri du tableau par ordre alphabétique
            // chartData.labels.sort();
            console.log("tri libellé : ", chartData.labels)

            let cptRoutes = []
            
            firstLine = true;
            let nbVoiesCom = 0
            let nbRoutesDep = 0
            let nbRoutesNat = 0
            let nbAutre = 0
            let nbAutoroute = 0
            
            //Parcours des specialités 
            chartData.labels.forEach(function(ch){
                //Initialisation du nombre pour le spécialité en cours
                
                //Parcours de la liste des villageois
                liste.value.forEach( (val) => {
                    //Si c'est la bonne spécialité
                    //on compte +1
                    if(!firstLine){
                        if(val[11] == 'Voie Communale') {nbVoiesCom++}
                        if (val[11] == 'Routes Départementales') {nbRoutesDep++}
                        if (val[11] == 'Routes Nationales') {nbRoutesNat++}
                        if (val[11] == 'Autre') {nbAutre++}
                        if (val[11] == 'Autoroute') {nbAutoroute++}
                    }
                
                })
                //on place le nb de villageois de cette spécialité dans le tableau de comptage
                
                firstLine = false //Mise ç faux de la 1° ligne
            })
            cptRoutes.push(nbVoiesCom);
            cptRoutes.push(nbRoutesDep);
            cptRoutes.push(nbRoutesNat);
            cptRoutes.push(nbAutre);
            cptRoutes.push(nbAutoroute);

            //on transfert le tableau de comptage dans les data
            chartData.datasets[0].data = cptRoutes;
            console.log("chartdata, " , chartData.datasets[0])

            //Calcul des couleurs et bordures
            let bgColor=[];
                let bdColor = [];
                //Pour chaque valeur existante
                cptRoutes.forEach( function(val){
                    //On calcul la couleur du secteur
                    let c1 = couleur(0, 255)
                    let c2 = couleur(0,255)
                    let c3 = couleur(0, 255)
                    let tr = 0.5
                    //Couleur avec transparence
                    let color = 'rgba(' + [c1, c2, c3, tr].join(',') +")"
                    bgColor.push(color)
                })
                //Chargement des couleurs et des bordures
                chartData.datasets[0].backgroundColor = bgColor;
                chartData.datasets[0].borderColor = bdColor;
                //chartData.datasets[1].backgroundColor = bgColor;
                //chartData.datasets[1].borderColor = bdColor;
        

    //Fonction de calcul aléatoire des couleurs
    
    })
    const couleur = (min, max) => {
        return Math.floor(Math.random() * (max - min));
    }
</script>

<template>
  <div>
    <Bar
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script scoped>
</script>