var app = {
  // Méthode d'initialisation
  // J'ai pis pour habitude de laisser le 'App initialized' pour être sur que ca se lance bien.
  // Creation de mon array qui contiendra mon plateau de jeu.
  // Creation de mon array qui contiendra les valeurs de css a comparées.
  // Creation du array qui contiendra tout nos temps de victoire.
  // Creation du array qui contiendra tout nos nombres de coups lors des victoire.
  // Creation du array qui contiendra toutes nos difficultés lors des victoire.
  // Creation du compteur de carte à comparées.
  // Creation du boolean qui empeche ou non le clique sur une autre carte.
  // Création de notre compteur timerTotal en cas de victoire.
  // Création de notre compteur tryTotal qui compte le nombre de pair essayé en cas de victoire.
  // => Lance la méthode downloadData pour récupéré les datas dans le localStorage.
  // On ajoute un écouteur d'event sur les 3 boutons qui lance la méthode chooseMode
  init: function () {
    console.log('App initialized');
    app.arrayCards = [];
    app.arrayCardCss = [];
    app.dataTime = [];
    app.dataTry = [];
    app.dataDifficulty = [];
    app.countCardToCompare = 0;
    app.canIClick = true;
    app.timerTotal = 0;
    app.tryTotal = 0;
    app.downloadData();
    $('.easy').on('click', app.chooseMode);
    $('.normal').on('click', app.chooseMode);
    $('.hard').on('click', app.chooseMode);
  },
  // Méthode qui définit la difficulté en fonction du bouton cliqué.
  // On modifie le nombre de carte et le timer en fonction.
  // On ajoute une class sur le plateau et le content général pour modifier les styles.
  // Puis on fait disparaitre les boutons.
  // On ajoute un écouteur d'event sur le click d'une carte caché.
  // A la fin => lance createArrayPosition pour avoir le tableau des position en mémoire.
  chooseMode: function () {
    app.difficultyMode = this.className;
    if (app.difficultyMode === 'easy') {
      app.numberOfCard = 16;
      app.timer = 50000;
      $('.container').addClass('easyMode');
      $('.plateau').addClass('easyyMode');
    }
    if (app.difficultyMode === 'normal') {
      app.numberOfCard = 28;
      app.timer = 60000;
    }
    if (app.difficultyMode === 'hard') {
      app.numberOfCard = 36;
      app.timer = 90000;
      $('.container').addClass('hardyMode');
      $('.plateau').addClass('hardyMode');
    }
    $('.plateau').css('backgroundColor', '#c6c4ff');
    $('.easy').hide();
    $('.normal').hide();
    $('.hard').hide();
    app.createArrayPosition();
    $('.cache').on('click', app.returnCard);
  },
  // Méthode pour créer un array qui contient toutes les positions
  // Ainsi chaque valeur de l'array contient une position
  // On s'en sert pour les modifier le background-position de chaque .image
  // A la fin => lance createCard qui va créer mes cartes et remplir mon array.
  createArrayPosition: function () {
    app.arrayPosition = [];
    for (var index = 0; index < 18; index++) {
      var position = '0 -'+index+'00px';
      app.arrayPosition.push(position);
    }
    app.createCard();
  },
  // Méthode pour la création des card (cartes).
  // On y imbrique deux div .cache .image.
  // Puis on push dans un array cette card.
  // A la fin => lance setBackgroundCard pour attribuer un background a chaque .image
  createCard: function () {
    for (var index = 0; index < app.numberOfCard; index++) {
      var card = $('<div>');
      var cardHidden = $('<div>');
      var cardVisible = $('<div>');
      cardHidden.appendTo(card).addClass('carte cache');
      cardVisible.appendTo(card).addClass('carte image');
      app.arrayCards.push(card);
    }
    app.setBackgroundCard();
  },
  // Méthode pour attribuer une position de background a 2 cartes.
  // On boucle sur le array qui contient nos cartes.
  // On va chercher l'élément enfant .image de l'index mais aussi index+1.
  // On attribe le css de l'index en cours app.arrayPosition.
  // A la fin => lance shuffleArrayCard pour mélanger les cartes.
  setBackgroundCard: function () {
    var indexArrayPosition = 0;
    for (var index = 0; index < app.arrayCards.length; index = index+2) {
      app.arrayCards[index].children('.image').css('backgroundPosition', app.arrayPosition[indexArrayPosition]);
      app.arrayCards[index+1].children('.image').css('backgroundPosition', app.arrayPosition[indexArrayPosition]);
      indexArrayPosition++;
    }
    app.shuffleArrayCard();
  },
  // Méthode pour mélanger notre array qui contient les cartes, et ce de manière aléatoire.
  // On utilise l'algorithme suffle de Fisher–Yates.
  // A la fin => lance createBoard pour injecter les cartes dans le DOM.
  shuffleArrayCard: function () {
    var j, x, i;
    for (i = app.arrayCards.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = app.arrayCards[i];
      app.arrayCards[i] = app.arrayCards[j];
      app.arrayCards[j] = x;
    }
    app.createBoard();
  },
  // Méthode qui injecte les cards dans le DOM a l'aide d'une boucle.
  // On ajoute a chaque card la classe 'carte'.
  // On affiche les .cache avec show()
  // On cache les .image avec hide()
  // A la fin => lance launchDecount pour lancer le décompte de temps.
  createBoard: function () {
    for (var index = 0; index < app.arrayCards.length; index++) {
      app.arrayCards[index].appendTo($('.plateau')).addClass('carte');
    }
    $('.cache').show();
    $('.image').hide();
    app.launchDecount();
  },
  // Méthode qui fait grandir la div rouge jusqu'a 100% en x seconde.
  // Mais qui lance aussi un compteur de x seconde.
  // Avec x qui dépends de la difficulté.
  // On créer aussi notre timer pour le récupéré en cas de victoire.
  // Au bout d'une minute on affiche un alert et on reload la page.
  launchDecount: function () {
    $('.progress').animate({width: '100%'}, app.timer);
    setTimeout(function () {
      window.alert('Dommage, mais tu es trop nul ! Retente ta chance.');
      window.location.reload();
    }, app.timer);
    setInterval(function () {
      app.timerTotal++;
    }, 1000);
  },
  // Méthode pour "retourner" la carte qui se déclanche au click sur .cache.
  // On vérifie que le boolean vaut bien true et donc qu'on puisse cliquer
  // On  cache l'élement .cache.
  // On affiche l'élement suivant .image.
  // On envoie le .image a la méthode compareCard.
  returnCard: function () {
    if (app.canIClick) {
      $(this).hide();
      $(this).next().show();
      app.compareCard($(this).next());
    }
  },
  // On incrémente le compteur de carte a comparée.
  // On push le backgroundPosition (BP) de l'image cliqué dans un array.
  // On ajoute a l'image la classe .active
  // Si on a deux cartes a comparée on vérifie les valeurs BP des deux carte.
  // Et on incrémente de 1 le compteur de pair essayée.
  // Si c'est différent on bloque le clique + 1sec après on retourne les cartes + enlève la classe active.
  // Si  c'est égale, c'est une paire, donc on ajoute la class found + appel de isItWon.
  // On reset le compteur de carte + le tableau qui contient les BP.
  compareCard: function (image) {
    app.countCardToCompare++;
    app.arrayCardCss.push(image.css('backgroundPosition'));
    image.addClass('active');
    if (app.countCardToCompare === 2) {
      app.tryTotal++;
      if (app.arrayCardCss[0] !== app.arrayCardCss[1]) {
        app.canIClick = false;
        setTimeout(function () {
          $('.active').hide();
          $('.active').prev().show();
          $('.active').removeClass('active');
          app.canIClick = true;
        }, 1000);
      } else {
        $('.active').addClass('found');
        $('.active').removeClass('active');
        app.isItWon();
      }
      app.countCardToCompare = 0;
      app.arrayCardCss.length = 0;
    }
  },
  // Méthode pour vérifié si on a gagné.
  // On compte le nombre de div ayant la class .found.
  // Si on les a toutes c'est gagné
  // => Lance la méthode uploadData pour upload les datas de la partie dans localStorage.
  // => 1 seconde plus tard message + reload la page.
  // Sinon on fait rien, le script continu.
  isItWon: function () {
    if ($('.found').length === app.numberOfCard){
      app.uploadData();
      setTimeout(function () {
        window.alert('Bien joué ! On dirais pas mais ce script est vachement balèze j\'espère que tu as profité !');
        window.location.reload();
      }, 1000);
    }
  },
  // Méthode pour récupéré les datas de temps dans le localStorage.
  // Si on le fait dès le début du script c'est pour afficher le tableau avant même le début de la partie.
  // Si on a déjà des données
  // => On les stock dans nos array.
  // => On lance la méthode setDataTable pour l'injection dans le DOM.
  downloadData: function () {
    if((localStorage.getItem('storageDataTime')) && (localStorage.getItem('storageDataTry'))) {
      app.dataTime = JSON.parse(localStorage.getItem('storageDataTime') || '[]');
      app.dataTry = JSON.parse(localStorage.getItem('storageDataTry') || '[]');
      app.dataDifficulty = JSON.parse(localStorage.getItem('storageDataDifficulty') || '[]');
      app.setDataTable();
    }
  },
  // Méthode pour upload les datas en LocalStorage.
  // Si aucune données n'ont été save précédemment :
  // => on push dans nos array nos datas de cette partie.
  // => on sauvegarde dans le localStorage aux keys qu'on veut.
  // Si on avait des données on les récupèrent et on les stock dans nos arrays.
  // => On push nos datas précédentes dans nos arrays.
  // => On y ajoute les datas de cette partie.
  // => On sauvegarde l'array mis a jour toujours aux keys correspondantes.
  uploadData: function () {
    if((!localStorage.getItem('storageDataTime')) || (!localStorage.getItem('storageDataTry')) || (!localStorage.getItem('storageDataDifficulty'))) {
      app.dataTime.push(app.timerTotal);
      app.dataTry.push(app.tryTotal);
      app.dataDifficulty.push(app.difficultyMode);
      localStorage.setItem('storageDataTime', JSON.stringify(app.dataTime));
      localStorage.setItem('storageDataTry', JSON.stringify(app.dataTry));
      localStorage.setItem('storageDataDifficulty', JSON.stringify(app.dataDifficulty));
    } else {
      app.dataTime = JSON.parse(localStorage.getItem('storageDataTime') || '[]');
      app.dataTry = JSON.parse(localStorage.getItem('storageDataTry') || '[]');
      app.dataDifficulty = JSON.parse(localStorage.getItem('storageDataDifficulty') || '[]');
      app.dataTime.push(app.timerTotal);
      app.dataTry.push(app.tryTotal);
      app.dataDifficulty.push(app.difficultyMode);
      localStorage.setItem('storageDataTime', JSON.stringify(app.dataTime));
      localStorage.setItem('storageDataTry', JSON.stringify(app.dataTry));
      localStorage.setItem('storageDataDifficulty', JSON.stringify(app.dataDifficulty));
    }
  },
  // Méthode pour injecter nos données dans le DOM.
  // On boucle sur notre array qui contient nos temps et on l'injecte dans le tbody.
  // On pourrais boucler sur n'importe lequel de nos arrays car on est sur qu'ils ont la même longueur.
  setDataTable: function () {
    for (var index = 0; index < app.dataTime.length; index++) {
      $('<tr><td>'+app.dataDifficulty[index]+'</td><td>'+app.dataTime[index]+'</td><td>'+app.dataTry[index]+'</td></tr>').appendTo($('tbody'));
    }
  },
};

$(app.init);
