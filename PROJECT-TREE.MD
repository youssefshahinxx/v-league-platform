-- Windows (PowerShell): tree /f /a
-- Mac / Linux: find . -maxdepth 3 -not -path '*/.*' (or install tree via Homebrew and run tree -L 3)

<!-- After every new stagging or production deployment try to make a quick project structure reavel, and save it. that May help you later through dubugging. -->

After every  new updates, add,  

|   |           array-set.js
|   |           base64-vlq.js
|   |           base64.js
|   |           binary-search.js
|   |           mapping-list.js
|   |           quick-sort.js
|   |           source-map-consumer.d.ts
|   |           source-map-consumer.js
|   |           source-map-generator.d.ts
|   |           source-map-generator.js
|   |           source-node.d.ts
|   |           source-node.js
|   |           util.js
|   |           
|   +---svelte
|   |   |   action.d.ts
|   |   |   animate.d.ts
|   |   |   compiler.d.ts
|   |   |   easing.d.ts
|   |   |   elements.d.ts
|   |   |   index.d.ts
|   |   |   legacy.d.ts
|   |   |   LICENSE.md
|   |   |   motion.d.ts
|   |   |   package.json
|   |   |   README.md
|   |   |   store.d.ts
|   |   |   svelte-html.d.ts
|   |   |   transition.d.ts
|   |   |   
|   |   +---compiler
|   |   |       index.js
|   |   |       package.json
|   |   |       
|   |   +---src
|   |   |   |   constants.js
|   |   |   |   escaping.js
|   |   |   |   html-tree-validation.js
|   |   |   |   index-client.js
|   |   |   |   index-server.js
|   |   |   |   utils.js
|   |   |   |   version.js
|   |   |   |   
|   |   |   +---animate
|   |   |   |       index.js
|   |   |   |       
|   |   |   +---attachments
|   |   |   |       index.js
|   |   |   |       
|   |   |   +---compiler
|   |   |   |   |   errors.js
|   |   |   |   |   index.js
|   |   |   |   |   legacy.js
|   |   |   |   |   state.js
|   |   |   |   |   validate-options.js
|   |   |   |   |   warnings.js
|   |   |   |   |   
|   |   |   |   +---migrate
|   |   |   |   |       index.js
|   |   |   |   |       
|   |   |   |   +---phases
|   |   |   |   |   |   bindings.js
|   |   |   |   |   |   css.js
|   |   |   |   |   |   nodes.js
|   |   |   |   |   |   patterns.js
|   |   |   |   |   |   scope.js
|   |   |   |   |   |   
|   |   |   |   |   +---1-parse
|   |   |   |   |   |   |   acorn.js
|   |   |   |   |   |   |   index.js
|   |   |   |   |   |   |   remove_typescript_nodes.js
|   |   |   |   |   |   |   
|   |   |   |   |   |   +---read
|   |   |   |   |   |   |       context.js
|   |   |   |   |   |   |       expression.js
|   |   |   |   |   |   |       options.js
|   |   |   |   |   |   |       script.js
|   |   |   |   |   |   |       style.js
|   |   |   |   |   |   |       
|   |   |   |   |   |   +---state
|   |   |   |   |   |   |       element.js
|   |   |   |   |   |   |       fragment.js
|   |   |   |   |   |   |       tag.js
|   |   |   |   |   |   |       text.js
|   |   |   |   |   |   |       
|   |   |   |   |   |   \---utils
|   |   |   |   |   |           bracket.js
|   |   |   |   |   |           create.js
|   |   |   |   |   |           entities.js
|   |   |   |   |   |           fuzzymatch.js
|   |   |   |   |   |           html.js
|   |   |   |   |   |           
|   |   |   |   |   +---2-analyze
|   |   |   |   |   |   |   index.js
|   |   |   |   |   |   |   
|   |   |   |   |   |   +---css
|   |   |   |   |   |   |       css-analyze.js
|   |   |   |   |   |   |       css-prune.js
|   |   |   |   |   |   |       css-warn.js
|   |   |   |   |   |   |       utils.js
|   |   |   |   |   |   |       
|   |   |   |   |   |   +---utils
|   |   |   |   |   |   |       check_graph_for_cycles.js
|   |   |   |   |   |   |       
|   |   |   |   |   |   \---visitors
|   |   |   |   |   |       |   AnimateDirective.js
|   |   |   |   |   |       |   ArrowFunctionExpression.js
|   |   |   |   |   |       |   AssignmentExpression.js
|   |   |   |   |   |       |   AttachTag.js
|   |   |   |   |   |       |   Attribute.js
|   |   |   |   |   |       |   AwaitBlock.js
|   |   |   |   |   |       |   AwaitExpression.js
|   |   |   |   |   |       |   BindDirective.js
|   |   |   |   |   |       |   CallExpression.js
|   |   |   |   |   |       |   ClassBody.js
|   |   |   |   |   |       |   ClassDeclaration.js
|   |   |   |   |   |       |   ClassDirective.js
|   |   |   |   |   |       |   Component.js
|   |   |   |   |   |       |   ConstTag.js
|   |   |   |   |   |       |   DebugTag.js
|   |   |   |   |   |       |   DeclarationTag.js
|   |   |   |   |   |       |   EachBlock.js
|   |   |   |   |   |       |   ExportDefaultDeclaration.js
|   |   |   |   |   |       |   ExportNamedDeclaration.js
|   |   |   |   |   |       |   ExportSpecifier.js
|   |   |   |   |   |       |   ExpressionStatement.js
|   |   |   |   |   |       |   ExpressionTag.js
|   |   |   |   |   |       |   Fragment.js
|   |   |   |   |   |       |   FunctionDeclaration.js
|   |   |   |   |   |       |   FunctionExpression.js
|   |   |   |   |   |       |   HtmlTag.js
|   |   |   |   |   |       |   Identifier.js
|   |   |   |   |   |       |   IfBlock.js
|   |   |   |   |   |       |   ImportDeclaration.js
|   |   |   |   |   |       |   KeyBlock.js
|   |   |   |   |   |       |   LabeledStatement.js
|   |   |   |   |   |       |   LetDirective.js
|   |   |   |   |   |       |   Literal.js
|   |   |   |   |   |       |   MemberExpression.js
|   |   |   |   |   |       |   NewExpression.js
|   |   |   |   |   |       |   OnDirective.js
|   |   |   |   |   |       |   PropertyDefinition.js
|   |   |   |   |   |       |   RegularElement.js
|   |   |   |   |   |       |   RenderTag.js
|   |   |   |   |   |       |   SlotElement.js
|   |   |   |   |   |       |   SnippetBlock.js
|   |   |   |   |   |       |   SpreadAttribute.js
|   |   |   |   |   |       |   SpreadElement.js
|   |   |   |   |   |       |   StyleDirective.js
|   |   |   |   |   |       |   SvelteBody.js
|   |   |   |   |   |       |   SvelteBoundary.js
|   |   |   |   |   |       |   SvelteComponent.js
|   |   |   |   |   |       |   SvelteDocument.js
|   |   |   |   |   |       |   SvelteElement.js
|   |   |   |   |   |       |   SvelteFragment.js
|   |   |   |   |   |       |   SvelteHead.js
|   |   |   |   |   |       |   SvelteSelf.js
|   |   |   |   |   |       |   SvelteWindow.js
|   |   |   |   |   |       |   TaggedTemplateExpression.js
|   |   |   |   |   |       |   TemplateElement.js
|   |   |   |   |   |       |   Text.js
|   |   |   |   |   |       |   TitleElement.js
|   |   |   |   |   |       |   TransitionDirective.js
|   |   |   |   |   |       |   UpdateExpression.js
|   |   |   |   |   |       |   UseDirective.js
|   |   |   |   |   |       |   VariableDeclarator.js
|   |   |   |   |   |       |   
|   |   |   |   |   |       \---shared
|   |   |   |   |   |           |   attribute.js
|   |   |   |   |   |           |   component.js
|   |   |   |   |   |           |   element.js
|   |   |   |   |   |           |   fragment.js
|   |   |   |   |   |           |   function.js
|   |   |   |   |   |           |   snippets.js
|   |   |   |   |   |           |   special-element.js
|   |   |   |   |   |           |   utils.js
|   |   |   |   |   |           |   
|   |   |   |   |   |           \---a11y
|   |   |   |   |   |                   constants.js
|   |   |   |   |   |                   index.js
|   |   |   |   |   |                   
|   |   |   |   |   \---3-transform
|   |   |   |   |       |   index.js
|   |   |   |   |       |   utils.js
|   |   |   |   |       |   
|   |   |   |   |       +---client
|   |   |   |   |       |   |   transform-client.js
|   |   |   |   |       |   |   utils.js
|   |   |   |   |       |   |   
|   |   |   |   |       |   +---transform-template
|   |   |   |   |       |   |       fix-attribute-casing.js
|   |   |   |   |       |   |       index.js
|   |   |   |   |       |   |       template.js
|   |   |   |   |       |   |       
|   |   |   |   |       |   \---visitors
|   |   |   |   |       |       |   AnimateDirective.js
|   |   |   |   |       |       |   ArrowFunctionExpression.js
|   |   |   |   |       |       |   AssignmentExpression.js
|   |   |   |   |       |       |   AttachTag.js
|   |   |   |   |       |       |   Attribute.js
|   |   |   |   |       |       |   AwaitBlock.js
|   |   |   |   |       |       |   AwaitExpression.js
|   |   |   |   |       |       |   BinaryExpression.js
|   |   |   |   |       |       |   BindDirective.js
|   |   |   |   |       |       |   BlockStatement.js
|   |   |   |   |       |       |   BreakStatement.js
|   |   |   |   |       |       |   CallExpression.js
|   |   |   |   |       |       |   ClassBody.js
|   |   |   |   |       |       |   Comment.js
|   |   |   |   |       |       |   Component.js
|   |   |   |   |       |       |   ConstTag.js
|   |   |   |   |       |       |   DebugTag.js
|   |   |   |   |       |       |   DeclarationTag.js
|   |   |   |   |       |       |   EachBlock.js
|   |   |   |   |       |       |   ExportNamedDeclaration.js
|   |   |   |   |       |       |   ExpressionStatement.js
|   |   |   |   |       |       |   ForOfStatement.js
|   |   |   |   |       |       |   Fragment.js
|   |   |   |   |       |       |   FunctionDeclaration.js
|   |   |   |   |       |       |   FunctionExpression.js
|   |   |   |   |       |       |   HtmlTag.js
|   |   |   |   |       |       |   Identifier.js
|   |   |   |   |       |       |   IfBlock.js
|   |   |   |   |       |       |   KeyBlock.js
|   |   |   |   |       |       |   LabeledStatement.js
|   |   |   |   |       |       |   LetDirective.js
|   |   |   |   |       |       |   MemberExpression.js
|   |   |   |   |       |       |   OnDirective.js
|   |   |   |   |       |       |   Program.js
|   |   |   |   |       |       |   RegularElement.js
|   |   |   |   |       |       |   RenderTag.js
|   |   |   |   |       |       |   SlotElement.js
|   |   |   |   |       |       |   SnippetBlock.js
|   |   |   |   |       |       |   SpreadAttribute.js
|   |   |   |   |       |       |   SvelteBody.js
|   |   |   |   |       |       |   SvelteBoundary.js
|   |   |   |   |       |       |   SvelteComponent.js
|   |   |   |   |       |       |   SvelteDocument.js
|   |   |   |   |       |       |   SvelteElement.js
|   |   |   |   |       |       |   SvelteFragment.js
|   |   |   |   |       |       |   SvelteHead.js
|   |   |   |   |       |       |   SvelteSelf.js
|   |   |   |   |       |       |   SvelteWindow.js
|   |   |   |   |       |       |   TitleElement.js
|   |   |   |   |       |       |   TransitionDirective.js
|   |   |   |   |       |       |   UpdateExpression.js
|   |   |   |   |       |       |   UseDirective.js
|   |   |   |   |       |       |   VariableDeclaration.js
|   |   |   |   |       |       |   
|   |   |   |   |       |       \---shared
|   |   |   |   |       |               component.js
|   |   |   |   |       |               declarations.js
|   |   |   |   |       |               element.js
|   |   |   |   |       |               events.js
|   |   |   |   |       |               fragment.js
|   |   |   |   |       |               function.js
|   |   |   |   |       |               special_element.js
|   |   |   |   |       |               utils.js
|   |   |   |   |       |               
|   |   |   |   |       +---css
|   |   |   |   |       |       index.js
|   |   |   |   |       |       
|   |   |   |   |       +---server
|   |   |   |   |       |   |   transform-server.js
|   |   |   |   |       |   |   
|   |   |   |   |       |   \---visitors
|   |   |   |   |       |       |   AssignmentExpression.js
|   |   |   |   |       |       |   AwaitBlock.js
|   |   |   |   |       |       |   AwaitExpression.js
|   |   |   |   |       |       |   CallExpression.js
|   |   |   |   |       |       |   ClassBody.js
|   |   |   |   |       |       |   Component.js
|   |   |   |   |       |       |   ConstTag.js
|   |   |   |   |       |       |   DebugTag.js
|   |   |   |   |       |       |   DeclarationTag.js
|   |   |   |   |       |       |   EachBlock.js
|   |   |   |   |       |       |   ExpressionStatement.js
|   |   |   |   |       |       |   Fragment.js
|   |   |   |   |       |       |   HtmlTag.js
|   |   |   |   |       |       |   Identifier.js
|   |   |   |   |       |       |   IfBlock.js
|   |   |   |   |       |       |   KeyBlock.js
|   |   |   |   |       |       |   LabeledStatement.js
|   |   |   |   |       |       |   MemberExpression.js
|   |   |   |   |       |       |   Program.js
|   |   |   |   |       |       |   PropertyDefinition.js
|   |   |   |   |       |       |   RegularElement.js
|   |   |   |   |       |       |   RenderTag.js
|   |   |   |   |       |       |   SlotElement.js
|   |   |   |   |       |       |   SnippetBlock.js
|   |   |   |   |       |       |   SpreadAttribute.js
|   |   |   |   |       |       |   SvelteBoundary.js
|   |   |   |   |       |       |   SvelteComponent.js
|   |   |   |   |       |       |   SvelteElement.js
|   |   |   |   |       |       |   SvelteFragment.js
|   |   |   |   |       |       |   SvelteHead.js
|   |   |   |   |       |       |   SvelteSelf.js
|   |   |   |   |       |       |   TitleElement.js
|   |   |   |   |       |       |   UpdateExpression.js
|   |   |   |   |       |       |   VariableDeclaration.js
|   |   |   |   |       |       |   
|   |   |   |   |       |       \---shared
|   |   |   |   |       |               component.js
|   |   |   |   |       |               element.js
|   |   |   |   |       |               utils.js
|   |   |   |   |       |               
|   |   |   |   |       \---shared
|   |   |   |   |               assignments.js
|   |   |   |   |               transform-async.js
|   |   |   |   |               
|   |   |   |   +---preprocess
|   |   |   |   |       decode_sourcemap.js
|   |   |   |   |       index.js
|   |   |   |   |       replace_in_code.js
|   |   |   |   |       
|   |   |   |   +---print
|   |   |   |   |       index.js
|   |   |   |   |       
|   |   |   |   \---utils
|   |   |   |           assert.js
|   |   |   |           ast.js
|   |   |   |           builders.js
|   |   |   |           compile_diagnostic.js
|   |   |   |           extract_svelte_ignore.js
|   |   |   |           mapped_code.js
|   |   |   |           push_array.js
|   |   |   |           sanitize_template_string.js
|   |   |   |           slot.js
|   |   |   |           string.js
|   |   |   |           
|   |   |   +---easing
|   |   |   |       index.js
|   |   |   |       
|   |   |   +---events
|   |   |   |       index.js
|   |   |   |       
|   |   |   +---internal
|   |   |   |   |   disclose-version.js
|   |   |   |   |   index.js
|   |   |   |   |   
|   |   |   |   +---client
|   |   |   |   |   |   constants.js
|   |   |   |   |   |   context.js
|   |   |   |   |   |   error-handling.js
|   |   |   |   |   |   errors.js
|   |   |   |   |   |   hydratable.js
|   |   |   |   |   |   index.js
|   |   |   |   |   |   legacy.js
|   |   |   |   |   |   loop.js
|   |   |   |   |   |   proxy.js
|   |   |   |   |   |   render.js
|   |   |   |   |   |   runtime.js
|   |   |   |   |   |   timing.js
|   |   |   |   |   |   validate.js
|   |   |   |   |   |   warnings.js
|   |   |   |   |   |   
|   |   |   |   |   +---dev
|   |   |   |   |   |       assign.js
|   |   |   |   |   |       console-log.js
|   |   |   |   |   |       css.js
|   |   |   |   |   |       debug.js
|   |   |   |   |   |       elements.js
|   |   |   |   |   |       equality.js
|   |   |   |   |   |       hmr.js
|   |   |   |   |   |       inspect.js
|   |   |   |   |   |       legacy.js
|   |   |   |   |   |       ownership.js
|   |   |   |   |   |       tracing.js
|   |   |   |   |   |       validation.js
|   |   |   |   |   |       
|   |   |   |   |   +---dom
|   |   |   |   |   |   |   css.js
|   |   |   |   |   |   |   hydration.js
|   |   |   |   |   |   |   operations.js
|   |   |   |   |   |   |   reconciler.js
|   |   |   |   |   |   |   task.js
|   |   |   |   |   |   |   template.js
|   |   |   |   |   |   |   
|   |   |   |   |   |   +---blocks
|   |   |   |   |   |   |       async.js
|   |   |   |   |   |   |       await.js
|   |   |   |   |   |   |       boundary.js
|   |   |   |   |   |   |       branches.js
|   |   |   |   |   |   |       css-props.js
|   |   |   |   |   |   |       each.js
|   |   |   |   |   |   |       html.js
|   |   |   |   |   |   |       if.js
|   |   |   |   |   |   |       key.js
|   |   |   |   |   |   |       slot.js
|   |   |   |   |   |   |       snippet.js
|   |   |   |   |   |   |       svelte-component.js
|   |   |   |   |   |   |       svelte-element.js
|   |   |   |   |   |   |       svelte-head.js
|   |   |   |   |   |   |       
|   |   |   |   |   |   +---elements
|   |   |   |   |   |   |   |   actions.js
|   |   |   |   |   |   |   |   attachments.js
|   |   |   |   |   |   |   |   attributes.js
|   |   |   |   |   |   |   |   class.js
|   |   |   |   |   |   |   |   custom-element.js
|   |   |   |   |   |   |   |   customizable-select.js
|   |   |   |   |   |   |   |   events.js
|   |   |   |   |   |   |   |   misc.js
|   |   |   |   |   |   |   |   style.js
|   |   |   |   |   |   |   |   transitions.js
|   |   |   |   |   |   |   |   
|   |   |   |   |   |   |   \---bindings
|   |   |   |   |   |   |           document.js
|   |   |   |   |   |   |           input.js
|   |   |   |   |   |   |           media.js
|   |   |   |   |   |   |           navigator.js
|   |   |   |   |   |   |           props.js
|   |   |   |   |   |   |           select.js
|   |   |   |   |   |   |           shared.js
|   |   |   |   |   |   |           size.js
|   |   |   |   |   |   |           this.js
|   |   |   |   |   |   |           universal.js
|   |   |   |   |   |   |           window.js
|   |   |   |   |   |   |           
|   |   |   |   |   |   \---legacy
|   |   |   |   |   |           event-modifiers.js
|   |   |   |   |   |           lifecycle.js
|   |   |   |   |   |           misc.js
|   |   |   |   |   |           
|   |   |   |   |   \---reactivity
|   |   |   |   |           async.js
|   |   |   |   |           batch.js
|   |   |   |   |           deriveds.js
|   |   |   |   |           effects.js
|   |   |   |   |           equality.js
|   |   |   |   |           props.js
|   |   |   |   |           sources.js
|   |   |   |   |           status.js
|   |   |   |   |           store.js
|   |   |   |   |           utils.js
|   |   |   |   |           
|   |   |   |   +---flags
|   |   |   |   |       async.js
|   |   |   |   |       index.js
|   |   |   |   |       legacy.js
|   |   |   |   |       tracing.js
|   |   |   |   |       
|   |   |   |   +---server
|   |   |   |   |   |   abort-signal.js
|   |   |   |   |   |   context.js
|   |   |   |   |   |   crypto.js
|   |   |   |   |   |   dev.js
|   |   |   |   |   |   errors.js
|   |   |   |   |   |   hydratable.js
|   |   |   |   |   |   hydration.js
|   |   |   |   |   |   index.js
|   |   |   |   |   |   render-context.js
|   |   |   |   |   |   renderer.js
|   |   |   |   |   |   warnings.js
|   |   |   |   |   |   
|   |   |   |   |   \---blocks
|   |   |   |   |           html.js
|   |   |   |   |           snippet.js
|   |   |   |   |           
|   |   |   |   \---shared
|   |   |   |           attributes.js
|   |   |   |           clone.js
|   |   |   |           dev.js
|   |   |   |           errors.js
|   |   |   |           utils.js
|   |   |   |           validate.js
|   |   |   |           warnings.js
|   |   |   |           
|   |   |   +---legacy
|   |   |   |       legacy-client.js
|   |   |   |       legacy-server.js
|   |   |   |       
|   |   |   +---motion
|   |   |   |       index.js
|   |   |   |       spring.js
|   |   |   |       tweened.js
|   |   |   |       utils.js
|   |   |   |       
|   |   |   +---reactivity
|   |   |   |   |   create-subscriber.js
|   |   |   |   |   date.js
|   |   |   |   |   index-client.js
|   |   |   |   |   index-server.js
|   |   |   |   |   map.js
|   |   |   |   |   media-query.js
|   |   |   |   |   reactive-value.js
|   |   |   |   |   set.js
|   |   |   |   |   url-search-params.js
|   |   |   |   |   url.js
|   |   |   |   |   
|   |   |   |   \---window
|   |   |   |           index.js
|   |   |   |           
|   |   |   +---server
|   |   |   |       index.js
|   |   |   |       
|   |   |   +---store
|   |   |   |   |   index-client.js
|   |   |   |   |   index-server.js
|   |   |   |   |   utils.js
|   |   |   |   |   
|   |   |   |   \---shared
|   |   |   |           index.js
|   |   |   |           
|   |   |   \---transition
|   |   |           index.js
|   |   |           
|   |   \---types
|   |       |   index.d.ts
|   |       |   index.d.ts.map
|   |       |   
|   |       \---compiler
|   |               interfaces.d.ts
|   |               preprocess.d.ts
|   |               
|   +---svelte-check
|   |   |   LICENSE
|   |   |   package.json
|   |   |   README.md
|   |   |   
|   |   +---bin
|   |   |       svelte-check
|   |   |       
|   |   +---dist
|   |   |   \---src
|   |   |           index.js
|   |   |           svelte-jsx-v4.d.ts
|   |   |           svelte-jsx.d.ts
|   |   |           svelte-native-jsx.d.ts
|   |   |           svelte-shims-v4.d.ts
|   |   |           svelte-shims.d.ts
|   |   |           
|   |   \---node_modules
|   |       +---chokidar
|   |       |   |   handler.d.ts
|   |       |   |   handler.js
|   |       |   |   index.d.ts
|   |       |   |   index.js
|   |       |   |   LICENSE
|   |       |   |   package.json
|   |       |   |   README.md
|   |       |   |   
|   |       |   \---esm
|   |       |           handler.d.ts
|   |       |           handler.js
|   |       |           index.d.ts
|   |       |           index.js
|   |       |           package.json
|   |       |           
|   |       \---readdirp
|   |           |   index.d.ts
|   |           |   index.js
|   |           |   LICENSE
|   |           |   package.json
|   |           |   README.md
|   |           |   
|   |           \---esm
|   |                   index.d.ts
|   |                   index.js
|   |                   package.json
|   |                   
|   +---svelte2tsx
|   |       index.d.ts
|   |       index.js
|   |       index.mjs
|   |       LICENSE
|   |       package.json
|   |       README.md
|   |       svelte-jsx-v4.d.ts
|   |       svelte-jsx.d.ts
|   |       svelte-native-jsx.d.ts
|   |       svelte-shims-v4.d.ts
|   |       svelte-shims.d.ts
|   |       
|   +---tailwindcss
|   |   |   index.css
|   |   |   LICENSE
|   |   |   package.json
|   |   |   preflight.css
|   |   |   README.md
|   |   |   theme.css
|   |   |   utilities.css
|   |   |   
|   |   \---dist
|   |           chunk-5JIJA4QV.mjs
|   |           chunk-C2OYBFIH.mjs
|   |           chunk-DCG7AFIE.mjs
|   |           colors-C__qRT83.d.ts
|   |           colors.d.mts
|   |           colors.d.ts
|   |           colors.js
|   |           colors.mjs
|   |           default-theme.d.mts
|   |           default-theme.d.ts
|   |           default-theme.js
|   |           default-theme.mjs
|   |           flatten-color-palette.d.mts
|   |           flatten-color-palette.d.ts
|   |           flatten-color-palette.js
|   |           flatten-color-palette.mjs
|   |           lib.d.mts
|   |           lib.d.ts
|   |           lib.js
|   |           lib.mjs
|   |           plugin.d.mts
|   |           plugin.d.ts
|   |           plugin.js
|   |           plugin.mjs
|   |           resolve-config-B4yBzhca.d.ts
|   |           resolve-config-QUZ9b-Gn.d.mts
|   |           types-DWdTiksJ.d.mts
|   |           
|   +---tapable
|   |   |   LICENSE
|   |   |   package.json
|   |   |   README.md
|   |   |   tapable.d.ts
|   |   |   
|   |   \---lib
|   |           AsyncParallelBailHook.js
|   |           AsyncParallelHook.js
|   |           AsyncSeriesBailHook.js
|   |           AsyncSeriesHook.js
|   |           AsyncSeriesLoopHook.js
|   |           AsyncSeriesWaterfallHook.js
|   |           Hook.js
|   |           HookCodeFactory.js
|   |           HookMap.js
|   |           index.js
|   |           MultiHook.js
|   |           SyncBailHook.js
|   |           SyncHook.js
|   |           SyncLoopHook.js
|   |           SyncWaterfallHook.js
|   |           util-browser.js
|   |           
|   +---tinyexec
|   |   |   LICENSE
|   |   |   package.json
|   |   |   README.md
|   |   |   
|   |   \---dist
|   |           main.d.mts
|   |           main.mjs
|   |           
|   +---tinyglobby
|   |   |   LICENSE
|   |   |   package.json
|   |   |   README.md
|   |   |   
|   |   \---dist
|   |           index.cjs
|   |           index.d.cts
|   |           index.d.mts
|   |           index.mjs
|   |           
|   +---totalist
|   |   |   index.d.ts
|   |   |   license
|   |   |   package.json
|   |   |   readme.md
|   |   |   
|   |   +---dist
|   |   |       index.js
|   |   |       index.mjs
|   |   |       
|   |   \---sync
|   |           index.d.ts
|   |           index.js
|   |           index.mjs
|   |           
|   +---tslib
|   |   |   CopyrightNotice.txt
|   |   |   LICENSE.txt
|   |   |   package.json
|   |   |   README.md
|   |   |   SECURITY.md
|   |   |   tslib.d.ts
|   |   |   tslib.es6.html
|   |   |   tslib.es6.js
|   |   |   tslib.es6.mjs
|   |   |   tslib.html
|   |   |   tslib.js
|   |   |   
|   |   \---modules
|   |           index.d.ts
|   |           index.js
|   |           package.json
|   |           
|   +---typescript
|   |   |   LICENSE.txt
|   |   |   package.json
|   |   |   README.md
|   |   |   SECURITY.md
|   |   |   ThirdPartyNoticeText.txt
|   |   |   
|   |   +---bin
|   |   |       tsc
|   |   |       tsserver
|   |   |       
|   |   \---lib
|   |       |   lib.d.ts
|   |       |   lib.decorators.d.ts
|   |       |   lib.decorators.legacy.d.ts
|   |       |   lib.dom.asynciterable.d.ts
|   |       |   lib.dom.d.ts
|   |       |   lib.dom.iterable.d.ts
|   |       |   lib.es2015.collection.d.ts
|   |       |   lib.es2015.core.d.ts
|   |       |   lib.es2015.d.ts
|   |       |   lib.es2015.generator.d.ts
|   |       |   lib.es2015.iterable.d.ts
|   |       |   lib.es2015.promise.d.ts
|   |       |   lib.es2015.proxy.d.ts
|   |       |   lib.es2015.reflect.d.ts
|   |       |   lib.es2015.symbol.d.ts
|   |       |   lib.es2015.symbol.wellknown.d.ts
|   |       |   lib.es2016.array.include.d.ts
|   |       |   lib.es2016.d.ts
|   |       |   lib.es2016.full.d.ts
|   |       |   lib.es2016.intl.d.ts
|   |       |   lib.es2017.arraybuffer.d.ts
|   |       |   lib.es2017.d.ts
|   |       |   lib.es2017.date.d.ts
|   |       |   lib.es2017.full.d.ts
|   |       |   lib.es2017.intl.d.ts
|   |       |   lib.es2017.object.d.ts
|   |       |   lib.es2017.sharedmemory.d.ts
|   |       |   lib.es2017.string.d.ts
|   |       |   lib.es2017.typedarrays.d.ts
|   |       |   lib.es2018.asyncgenerator.d.ts
|   |       |   lib.es2018.asynciterable.d.ts
|   |       |   lib.es2018.d.ts
|   |       |   lib.es2018.full.d.ts
|   |       |   lib.es2018.intl.d.ts
|   |       |   lib.es2018.promise.d.ts
|   |       |   lib.es2018.regexp.d.ts
|   |       |   lib.es2019.array.d.ts
|   |       |   lib.es2019.d.ts
|   |       |   lib.es2019.full.d.ts
|   |       |   lib.es2019.intl.d.ts
|   |       |   lib.es2019.object.d.ts
|   |       |   lib.es2019.string.d.ts
|   |       |   lib.es2019.symbol.d.ts
|   |       |   lib.es2020.bigint.d.ts
|   |       |   lib.es2020.d.ts
|   |       |   lib.es2020.date.d.ts
|   |       |   lib.es2020.full.d.ts
|   |       |   lib.es2020.intl.d.ts
|   |       |   lib.es2020.number.d.ts
|   |       |   lib.es2020.promise.d.ts
|   |       |   lib.es2020.sharedmemory.d.ts
|   |       |   lib.es2020.string.d.ts
|   |       |   lib.es2020.symbol.wellknown.d.ts
|   |       |   lib.es2021.d.ts
|   |       |   lib.es2021.full.d.ts
|   |       |   lib.es2021.intl.d.ts
|   |       |   lib.es2021.promise.d.ts
|   |       |   lib.es2021.string.d.ts
|   |       |   lib.es2021.weakref.d.ts
|   |       |   lib.es2022.array.d.ts
|   |       |   lib.es2022.d.ts
|   |       |   lib.es2022.error.d.ts
|   |       |   lib.es2022.full.d.ts
|   |       |   lib.es2022.intl.d.ts
|   |       |   lib.es2022.object.d.ts
|   |       |   lib.es2022.regexp.d.ts
|   |       |   lib.es2022.string.d.ts
|   |       |   lib.es2023.array.d.ts
|   |       |   lib.es2023.collection.d.ts
|   |       |   lib.es2023.d.ts
|   |       |   lib.es2023.full.d.ts
|   |       |   lib.es2023.intl.d.ts
|   |       |   lib.es2024.arraybuffer.d.ts
|   |       |   lib.es2024.collection.d.ts
|   |       |   lib.es2024.d.ts
|   |       |   lib.es2024.full.d.ts
|   |       |   lib.es2024.object.d.ts
|   |       |   lib.es2024.promise.d.ts
|   |       |   lib.es2024.regexp.d.ts
|   |       |   lib.es2024.sharedmemory.d.ts
|   |       |   lib.es2024.string.d.ts
|   |       |   lib.es2025.collection.d.ts
|   |       |   lib.es2025.d.ts
|   |       |   lib.es2025.float16.d.ts
|   |       |   lib.es2025.full.d.ts
|   |       |   lib.es2025.intl.d.ts
|   |       |   lib.es2025.iterator.d.ts
|   |       |   lib.es2025.promise.d.ts
|   |       |   lib.es2025.regexp.d.ts
|   |       |   lib.es5.d.ts
|   |       |   lib.es6.d.ts
|   |       |   lib.esnext.array.d.ts
|   |       |   lib.esnext.collection.d.ts
|   |       |   lib.esnext.d.ts
|   |       |   lib.esnext.date.d.ts
|   |       |   lib.esnext.decorators.d.ts
|   |       |   lib.esnext.disposable.d.ts
|   |       |   lib.esnext.error.d.ts
|   |       |   lib.esnext.full.d.ts
|   |       |   lib.esnext.intl.d.ts
|   |       |   lib.esnext.sharedmemory.d.ts
|   |       |   lib.esnext.temporal.d.ts
|   |       |   lib.esnext.typedarrays.d.ts
|   |       |   lib.scripthost.d.ts
|   |       |   lib.webworker.asynciterable.d.ts
|   |       |   lib.webworker.d.ts
|   |       |   lib.webworker.importscripts.d.ts
|   |       |   lib.webworker.iterable.d.ts
|   |       |   tsc.js
|   |       |   tsserver.js
|   |       |   tsserverlibrary.d.ts
|   |       |   tsserverlibrary.js
|   |       |   typescript.d.ts
|   |       |   typescript.js
|   |       |   typesMap.json
|   |       |   typingsInstaller.js
|   |       |   watchGuard.js
|   |       |   _tsc.js
|   |       |   _tsserver.js
|   |       |   _typingsInstaller.js
|   |       |   
|   |       +---cs
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---de
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---es
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---fr
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---it
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---ja
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---ko
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---pl
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---pt-br
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---ru
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---tr
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       +---zh-cn
|   |       |       diagnosticMessages.generated.json
|   |       |       
|   |       \---zh-tw
|   |               diagnosticMessages.generated.json
|   |               
|   +---vite
|   |   |   client.d.ts
|   |   |   LICENSE.md
|   |   |   package.json
|   |   |   README.md
|   |   |   
|   |   +---bin
|   |   |       openChrome.js
|   |   |       vite.js
|   |   |       
|   |   +---dist
|   |   |   +---client
|   |   |   |       client.mjs
|   |   |   |       env.mjs
|   |   |   |       
|   |   |   \---node
|   |   |       |   cli.js
|   |   |       |   index.d.ts
|   |   |       |   index.js
|   |   |       |   internal.d.ts
|   |   |       |   internal.js
|   |   |       |   module-runner.d.ts
|   |   |       |   module-runner.js
|   |   |       |   
|   |   |       \---chunks
|   |   |               build.js
|   |   |               dist.js
|   |   |               lib.js
|   |   |               moduleRunnerTransport.d.ts
|   |   |               node.js
|   |   |               postcss-import.js
|   |   |               
|   |   +---misc
|   |   |       false.js
|   |   |       true.js
|   |   |       
|   |   \---types
|   |       |   customEvent.d.ts
|   |       |   hmrPayload.d.ts
|   |       |   hot.d.ts
|   |       |   import-meta.d.ts
|   |       |   importGlob.d.ts
|   |       |   importMeta.d.ts
|   |       |   metadata.d.ts
|   |       |   
|   |       \---internal
|   |               cssPreprocessorOptions.d.ts
|   |               esbuildOptions.d.ts
|   |               lightningcssOptions.d.ts
|   |               rollupTypeCompat.d.ts
|   |               terserOptions.d.ts
|   |               
|   +---vitefu
|   |   |   LICENSE
|   |   |   package.json
|   |   |   README.md
|   |   |   
|   |   \---src
|   |           index.cjs
|   |           index.d.cts
|   |           index.d.ts
|   |           index.js
|   |           sync.cjs
|   |           
|   \---zimmerframe
|       |   LICENSE
|       |   package.json
|       |   README.md
|       |   
|       +---src
|       |       index.d.ts
|       |       types.d.ts
|       |       walk.js
|       |       
|       \---types
|               index.d.ts
|               index.d.ts.map
|               
+---src
|   |   app.css
|   |   app.d.ts
|   |   app.html
|   |   
|   +---lib
|   |   |   supabase.js
|   |   |   
|   |   +---components
|   |   |   +---features
|   |   |   |       AthleteGridItem.svelte
|   |   |   |       CompetitionCard.svelte
|   |   |   |       RankingRow.svelte
|   |   |   |       
|   |   |   +---layout
|   |   |   |       Footer.svelte
|   |   |   |       Navbar.svelte
|   |   |   |       
|   |   |   \---ui
|   |   |           Badge.svelte
|   |   |           Button.svelte
|   |   |           Card.svelte
|   |   |           
|   |   \---utils
|   |           rankingAlgo.js
|   |           
|   \---routes
|       |   +layout.js
|       |   +layout.svelte
|       |   +page.svelte
|       |   
|       +---athletes
|       |   |   +page.svelte
|       |   |   
|       |   \---[username]
|       |           +page.svelte
|       |           
|       +---auth
|       |   |   +page.svelte
|       |   |   
|       |   \---logout
|       |           +server.js
|       |           
|       +---blog
|       |   |   +page.svelte
|       |   |   
|       |   \---[slug]
|       |           +page.svelte
|       |           
|       +---competitions
|       |   |   +page.svelte
|       |   |   
|       |   \---[id]
|       |           +page.svelte
|       |           
|       +---profile
|       |   \---edit
|       |           +page.server.js
|       |           +page.svelte
|       |           
|       +---ranking
|       |       +page.js
|       |       +page.svelte
|       |       
|       \---src
|           \---routes
|                   +layout.js
|                   
\---static
    |   favicon.svg
    |   
    \---icons