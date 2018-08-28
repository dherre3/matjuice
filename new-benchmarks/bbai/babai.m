function z_hat = babai(R,y)
%%
%   compute the Babai estimation
%   find a sub-optimal solution for min_z ||R*z-y||_2
%   R - an upper triangular real matrix of n-by-n
%   y - a real vector of n-by-1
%   z_hat - resulting integer vector
%
% h = [[2,3,4],[3,4]]
a = colon([2,2,2],[3],[2])
n=length(y);
z_hat=zeros(n,1);
z_hat(n)=round(y(n)./R(n,n));
g = ones([1,2])
k = ones([3,5,2,1,1,1])

a1 = ones(2,2)
a2 = randn(2,2)
h =  [1,2] + [1,2].*a2

end
