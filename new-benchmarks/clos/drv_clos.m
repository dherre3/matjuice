function drv_clos(scale)
%%
%% Driver for the transitive closure of a directed graph.
%%

N=450;
tic()
for time=1:scale
  B=closure(N);
end
t = toc()
disp(t)
end

