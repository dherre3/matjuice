# Errors in MatJuice V1
```JavaScript
// EXAMPLES OF ERROS IN ORIGINAL MATJUICE
colon([3,2,10],1,10)
g = ones([1,2,3])
```

# Ideas for analysis

Make input to functions more cannonical. So based on the inputs, convert to a form 
that can be handled fine.
# How to handle scalar inputs vs. vector inputs
For MatJuice, we can have a wrapper in wasm. For MatWably we can have 