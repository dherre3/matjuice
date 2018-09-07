function [c] = array_get()
A = randn(3,7,2)
c = A([1,2],[2,3],2)
end