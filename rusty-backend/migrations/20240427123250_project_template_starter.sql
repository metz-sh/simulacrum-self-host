INSERT INTO project_templates(name, description, project_art, project_artifacts) VALUES (
    'Hello World',
    'This is a simple project tasked with showing the fundamentals.',
    '{"iconString": "logos:visual-studio-code", "iconColorVariant": "dark"}',
    '{"build": {"state": "built", "artificats": {"edges": [{"edge": {"id": "e0", "data": {"sourceXOffset": 100}, "type": "baseEdge", "source": "Containerapp", "target": "DBgetData", "sourceHandle": "right", "targetHandle": "left"}, "sourceClassName": "Container", "destinationClassName": "DB"}], "nodes": [{"id": "k8s", "size": {"width": "645px", "height": "540px"}, "type": "containerNode", "title": "k8s", "trueId": "k8s", "filePath": "k8s", "position": {"x": 12, "y": 12}}, {"id": "Container", "size": {"width": "410px", "height": "310px"}, "type": "containerNode", "title": "Container", "hidden": false, "trueId": "Container", "comment": "", "handles": [{"id": "right", "type": "source", "position": "right"}, {"id": "left", "type": "target", "position": "left"}], "filePath": "app/k8s/container.ts", "position": {"x": 110, "y": 130}, "className": "Container", "parentNode": "k8s", "propertyDeclarationTypeMap": {"db": "DB", "logResult": "boolean"}}, {"id": "Containerapp", "size": {"width": "200px", "height": "80px"}, "type": "baseNode", "title": "app", "hidden": false, "trueId": "Containerapp", "comment": "", "filePath": "app/k8s/container.ts", "position": {"x": 110, "y": 130}, "className": "Container", "signature": "() => void", "methodName": "app", "parentNode": "Container", "argumentHash": ""}, {"id": "DB", "size": {"width": "410px", "height": "310px"}, "type": "containerNode", "title": "DB", "hidden": false, "trueId": "DB", "comment": "", "filePath": "app/db.ts", "position": {"x": 957, "y": 142}, "className": "DB", "propertyDeclarationTypeMap": {}}, {"id": "DBgetData", "size": {"width": "200px", "height": "80px"}, "type": "baseNode", "title": "getData", "hidden": false, "trueId": "DBgetData", "comment": "", "handles": [{"id": "right", "type": "source", "position": "right"}, {"id": "left", "type": "target", "position": "left"}], "filePath": "app/db.ts", "position": {"x": 110, "y": 130}, "className": "DB", "signature": "() => string", "methodName": "getData", "parentNode": "DB", "argumentHash": ""}], "bundle": "class Container {\n    async *app() {\n        let gb_caf;\n        let [] = gb_caf = yield { state: \"PROVIDE_INPUT\" };\n        yield { state: \"HANDLE_INPUT_RECEIVED\", input: gb_caf, argumentNames: [] };\n        const result = `Hello ${yield * ((async function* () {\n            const result = await this.handlers[\"DBgetData\"].call(...(yield * ((async function* () {\n                const arg_result = [];\n                yield { state: \"CALL_NODE\", nodeId: \"DBgetData\", prettyNodeId: \"DB.getData\" };\n                return arg_result;\n            }).bind(this))()));\n            yield { state: \"HANDLE_CALL_RESULT\", nodeId: \"DBgetData\", prettyNodeId: \"DB.getData\", value: result };\n            return result;\n        }).bind(this))()}`;\n        if (this.logResult) {\n            yield * ((async function* () {\n                yield { state: \"LOG\", params: [result] };\n            }).bind(this))();\n        }\n    }\n}\nclass DB {\n    async *getData() { let cca_cgh; let [] = cca_cgh = yield { state: \"PROVIDE_INPUT\" }; yield { state: \"HANDLE_INPUT_RECEIVED\", input: cca_cgh, argumentNames: [] }; return ''World!''; }\n}\nfunction project_54f75db341ad4dc09553d98c273a5113_getClassesAndMethods() {\n    return [\n        {\n            nodeId: \"Container\",\n            className: \"Container\",\n            class: Container,\n            methods: [\n                { nodeId: \"Containerapp\", name: \"app\", isMarked: true }\n            ]\n        },\n        {\n            nodeId: \"DB\",\n            className: \"DB\",\n            class: DB,\n            methods: [\n                { nodeId: \"DBgetData\", name: \"getData\", isMarked: true }\n            ]\n        }\n    ];\n}\n", "projectVersion": 0, "storyScriptHelpers": "\n\t\tconst methodMarkedMap: Record<string, {[key: string]: boolean}> = {\"Container\":{\"app\":true},\"DB\":{\"getData\":true}};\n\t\tconst entryPointsCalled: any[] = [];\n\t\tconst classMemberSetup: any = {};\n\n\t\tconst classMemberSetupProxyHandler = {\n\t\t\tset (target: any, key: string, value: any) {\n\t\t\t\tconst [_, ...className] = target.constructor.name;\n\t\t\t\tconst isMarked = methodMarkedMap[className as string][key];\n\t\t\t\tif(typeof value === ''function'' && isMarked) {\n\t\t\t\t\tthrow new Error(`Please don''t override public methods.\n\nThey are already compiled and processed, changing them will undo that.\nIf you want, you can move some logic to a private method and override that here.`)\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\tclassMemberSetup[className] = {\n\t\t\t\t\t...classMemberSetup[className],\n\t\t\t\t\t[key]: value,\n\t\t\t\t}\n\t\t\t  \treturn true\n\t\t\t}\n\t\t}\n\t\n\t\t\tclass IContainer {\n\t\t\t\t\n\t\t\t\t\tapp(...params: Arguments<''Container'', ''app''> ):void {\n\t\t\t\t\t\tentryPointsCalled.push({\n\t\t\t\t\t\t\tnodeId: ''Containerapp'',\n\t\t\t\t\t\t\tclassName: ''Container'',\n\t\t\t\t\t\t\tmethodName: ''app'',\n\t\t\t\t\t\t\targuments,\n\t\t\t\t\t\t})\n\t\t\t\t\t}\n\t\t\t\t\n\t\t\t}\n\t\t\tconst container = new Proxy<Container>(new IContainer() as any, classMemberSetupProxyHandler);\n\n\t\t\n\t\t\tclass IDB {\n\t\t\t\t\n\t\t\t\t\tgetData(...params: Arguments<''DB'', ''getData''> ):void {\n\t\t\t\t\t\tentryPointsCalled.push({\n\t\t\t\t\t\t\tnodeId: ''DBgetData'',\n\t\t\t\t\t\t\tclassName: ''DB'',\n\t\t\t\t\t\t\tmethodName: ''getData'',\n\t\t\t\t\t\t\targuments,\n\t\t\t\t\t\t})\n\t\t\t\t\t}\n\t\t\t\t\n\t\t\t}\n\t\t\tconst db = new Proxy<DB>(new IDB() as any, classMemberSetupProxyHandler);\n\n\t\t", "storyHelperDefinitions": "\n\texport {};\n\n\tdeclare global {\n\t\t\n\ttype classes = ''Container'' | ''DB''\n\n\t\n\ttype classNameMap<T extends classes> = \n\tT extends ''Container'' ? Container :\n\tT extends ''DB'' ? DB:never\n\t\n\n\t\ttype Members<T> = { [P in keyof T as T[P] extends Function ? never : P]: T[P] };\n\t\ttype Methods<T> = { [P in keyof T as T[P] extends Function ? P : never]: T[P] };\n\n\t\t/** Include property keys from T where the property is assignable to U */\n\t\ttype IncludePropertyKeys<T, U>  = { [P in keyof T]: T[P] extends U ? P : never}[keyof T]\n\t\t/** Excludes property keys from T where the property is assignable to U */\n\t\ttype ExcludePropertyKeys<T, U>  = { [P in keyof T]: T[P] extends U ? never: P}[keyof T]\n\n\t\t/** Includes properties from T where the property is assignable to U */\n\t\ttype IncludePropertyTypes<T, U> = { [K in IncludePropertyKeys<T, U>]: T[K] }\n\t\t/** Excludes properties from T where the property is assignable to U */\n\t\ttype ExcludePropertyTypes<T, U> = { [K in ExcludePropertyKeys<T, U>]: T[K] }\n\n\t\t/** Makes properties of type T optional where the property is assignable to U */\n\t\ttype OptionalPropertyType<T, U> = ExcludePropertyTypes<T, U> & Partial<IncludePropertyTypes<T, U>>\n\t\t/** Makes properties of type T readonly where the property is assignable to U */\n\t\ttype ReadonlyPropertyType<T, U> = ExcludePropertyTypes<T, U> & Readonly<IncludePropertyTypes<T, U>>\n\t\t\n\t\ttype Initializers = {\n\t\t[key in classes]?: Members<classNameMap<key>>\n\t\t}\n\n\t\t/**\n\t\t * The Story object\n\t\t * @typedef {Object} Story\n\t\t * @property {string} journey - All stories belong to a journey. This allows you to create categories\n\t\t * @property {string} title - Title which you will see on playground.\n\t\t * @property {Object} setup - A key can be a class name and the value can be an object representing that class''s members\n\t\t * @property {Array} entrypointParameters - If you need to pass paramaters to you entrypoint function\n\t\t*/\n\t\ttype Story<T extends classes, K extends keyof Methods<classNameMap<T>>> = {\n\t\t/**\n\t\t All stories belong to a journey. This allows you to create categories.\n\t\t*/\n\t\tjourney: string,\n\t\t\n\t\t/**\n\t\t Title which you will see on playground.\n\t\t*/\n\t\ttitle: string,\n\n\t\t/**\n\t\t * This is an object where a key can be a class name and the value can be an object representing that class''s members.\n\t\t * Use this to set up your story with your parameters.\n\t\t*/\n\t\tsetup: Initializers,\n\t\t\n\t\t/**\n\t\t\tIf your entrypoint function takes arguments, pass them as array here.\n\t\t*/\n\t\tentrypointParameters: Parameters<classNameMap<T>[K]>,\n\t\t}\n\n\t\ttype Arguments<T extends classes, K extends keyof Methods<classNameMap<T>>> = Parameters<classNameMap<T>[K]>;\n\n\t\ttype Setup<T extends classes> = Members<classNameMap<T>>;\n\n\t\t/**\n\t\t * This function creates stories which get rendered on playground\n\t\t * @template ClassName - Entrypoint Class\n\t\t * @template MethodName - Specific method of Class that you want as entrypoint\n\t\t * @param {Story} story\n\t\t*/\n\t\tfunction createStory<T extends classes, K extends keyof Methods<classNameMap<T>>>(story: Story<T, K>): void;\n\t}\n\t"}}, "display": {"edgeMap": {"e0": {"data": {"label": "This is where you describe the connection"}}}, "nodeMap": {"DB": {"data": {"iconData": {"iconString": "logos:neon-icon", "iconColorVariant": "dark"}}}, "k8s": {"data": {"iconData": {"iconString": "logos:kubernetes", "iconColorVariant": "dark"}}}, "Container": {"data": {"iconData": {"iconString": "logos:docker-icon", "iconColorVariant": "dark"}}}, "DBgetData": {"data": {"iconData": {"iconString": "logos:postgresql", "iconColorVariant": "dark"}}, "position": {"x": 110.6165770588118, "y": 129.3834229411882}}, "Containerapp": {"data": {"iconData": {"iconString": "logos:nodejs", "iconColorVariant": "light"}}, "position": {"x": 109.22462746285805, "y": 129.22462746285805}}}}, "project": [{"path": "app/k8s/container.ts", "value": "class Container {\n    private db: DB;\n    logResult: boolean\n    app() {\n        const result = `Hello ${this.db.getData()}`;\n        if(this.logResult) {\n            console.log(result);\n        }\n    }\n}\n"}, {"path": "app/db.ts", "value": "class DB {\n    getData() {\n        return ''World!'';\n    }\n}"}], "updatedAt": "2024-04-27T12:30:51.056Z", "storySetups": [{"id": "0", "title": "Default Story", "script": {"raw": "container.app();\ncontainer.logResult = true;", "compiled": "const classMemberSetup={ Container: { logResult: true } }; const entryPointsCalled = [{nodeId: ''Containerapp'', className: ''Container'', methodName: ''app'', arguments:[]}];"}}, {"id": "1", "title": "test"}], "entryFilePath": "app/k8s/container.ts"}'
);