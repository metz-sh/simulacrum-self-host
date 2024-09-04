export const diagrammingTools = `
class DiagrammingTools {
    vd: VisualDocumentation;

    subparSolution2(problem: string) {
        this.vd.problem2('What if they could tell stories?');
    }

    subparSolution1(problem: string) {
        this.vd.problem2('What if they could tell stories?');
    }

    problem1(problem: string) {
        this.vd.problem2('What if they could tell stories?');
    }
}

class VisualDocumentation {
    /**
     * Simply add classes as a dependency. The runtime takes care of everything
    */
    metz: Metz;

    problem2(arg: string) {
        this.problem3()
    }

    problem3() {
        console.log('What if you never have to update them?');
        this.metz.butHow();
    }
}
`;

export const metz = `
/**
 * Each file can contain either a type, enum or a class at top level.
 * This class forms the outer box
 */
class Metz {

    /**
     * Each method forms the inner box and you can call other methods from here to form a connection.
     */
    butHow() {
        this.solution();
    }

    /**
     * A console.log is a special function call where it's materialized as a popup!
     */
    solution() {
        console.log('What if code is diagram?')
    }
}
`;
