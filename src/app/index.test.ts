interface Action {
    lanceur(param: Personnage): Action;

    resolve(): any; // DISPATCH THIS
}

interface Ciblable {
    santé: number;
}

interface Acteur {
}

class Attaque implements Action {

    private _lanceur: Acteur;
    private _cible: Ciblable;

    resolve(): any {
        this._cible.santé = this._cible?.santé - 100;
    }

    lanceur(lanceur: Personnage): Action {
        this._lanceur = lanceur;
        return this;
    }

    sur(cible: Ciblable): Action {
        this._cible = cible;
        return this;
    }
}

class Personnage implements Acteur, Ciblable {

    santé: number = 1000;
    private readonly race: string = "Humain";

    estEnVie() {
        return true;
    }

    effectue(action: Action) : Action {
        return action.lanceur(this);
    }
}

it(`Un nouveau personnage doit avoir 1000 pv`, () => {
    let personnage = new Personnage();
    expect(personnage).toHaveProperty("santé", 1000);
});

it(`Un nouveau personnage est en vie`, () => {
    let personnage = new Personnage();
    expect(personnage.estEnVie()).toBeTruthy();
});

it(`Un personnage attaque un autre`, () => {
    // COMBAT come un "state" => chaque avction est un event du combat
    // vs COMBAT comme un event dans uen state "WORLD"
    // > BOUNDED CONTEXT
    let personnage = new Personnage();
    let adversaire = new Personnage();

    let action = personnage.effectue(new Attaque().sur(adversaire));
    action.resolve()

    expect(adversaire).toHaveProperty("santé", 900);
});