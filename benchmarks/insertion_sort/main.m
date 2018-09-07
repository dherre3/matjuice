function main(size)
    A = randn(1, size);
    A = [0.5548937097749504,  0.49073352171125084,0.40375233759650636,0.512868613564949, 0.4968593912888911,0.7177614024355157, 0.4938946307229754,0.4818076294199497, 0.4896823545799145, 0.6044712280841823 ];
    disp(A)
    tic();
    B = insertion_sort(A, size);
    t = toc();
    disp(B)
    ok = 1;
    for i = 1:size-1
        if B(i) > B(i+1)
            ok = 0;
            break;
        end
    end
    disp(ok);
    disp(t);
end

