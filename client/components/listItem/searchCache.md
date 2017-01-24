#  Ideal Components for Caching
Any “pure” component can be safely cached - that is, any component that is guaranteed to generate the same HTML given the same props. Common examples of these include:

- Static components (i.e. they always generate the same HTML, so the serverCacheKey function can just return true)
- List item components (when part of large lists, caching these can significantly improve performance)
- Generic UI components (e.g. buttons, alerts, etc - at least those that accept content through props rather than slots/children)