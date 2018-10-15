import pandas as pd
import numpy as np
from classes.speedup import histogram_plot
from classes.preprocess import new_column
import matplotlib.pyplot as plt
from  scipy.stats.mstats import gmean


dt_JS = pd.read_csv("./results-js-2018.10.12.csv")
dt_WASM = pd.read_csv("./results-js-wasm-2018.10.12.csv")
dt_MatWably = pd.read_csv("./results-matwably-2018.10.12.csv")

dt_MatWably = new_column(dt_MatWably, size=dt_MatWably["benchmark"].size, position=1, column_name="implementation",
                   name="wasm")
dt_MatWably = new_column(dt_MatWably, size=dt_MatWably["benchmark"].size, position=2, column_name="environment",
                           name="node")
dt_MatWably = new_column(dt_MatWably, size=dt_MatWably["benchmark"].size, position=3, column_name="compiler",
                           name="MatWably")

dt_JS = new_column(dt_JS, size=dt_JS["benchmark"].size, position=1, column_name="implementation",
                   name="JS")
dt_JS = new_column(dt_JS, size=dt_JS["benchmark"].size, position=2, column_name="environment",
                           name="node")
dt_JS = new_column(dt_JS, size=dt_JS["benchmark"].size, position=3, column_name="compiler",
                           name="Matjuice")


dt_WASM = new_column(dt_WASM, size=dt_WASM["benchmark"].size, position=1, column_name="implementation",
                   name="JS-WASM")
dt_WASM = new_column(dt_WASM, size=dt_WASM["benchmark"].size, position=2, column_name="environment",
                name="node")
dt_WASM = new_column(dt_WASM, size=dt_WASM["benchmark"].size, position=3, column_name="compiler",
                name="Matjuice-v2")

print(dt_JS)
print(dt_WASM)
mean_JS = np.array(dt_JS["kernel_time_mean"])
mean_WASM = np.array(dt_WASM["kernel_time_mean"])
mean_MATWA = np.array(dt_MatWably["kernel_time_mean"])
res = np.divide(mean_JS, mean_WASM)
res2 = np.divide(mean_JS, mean_MATWA)
print(res, np.mean(res))
geo = gmean(res)
geo2 = gmean(res2)
res = np.append(res,geo)
res2 = np.append(res2,geo2)
ind = np.arange(15)
# wasm speed up over js
print( np.unique(dt_WASM["benchmark"]))
print(np.array(dt_WASM["benchmark"]))
xtick= ['drv_clos', 'drv_collatz', 'drv_crni', 'drv_dich',
 'drv_fdtd', 'drv_fft' ,'drv_fiff', 'drv_lgdr',
 'drv_matmul_p', 'drv_mcpi_p', 'drv_prime', 'drv_babai',
 'drv_bubble', 'drv_capr','geomean']
colors = ['g', 'r', 'c', 'm', 'y', 'b', 'k', 'maroon', 'lightpink', 'teal']
fig, ax = plt.subplots(figsize=(15, 10))
print(res)
print(res2)
# re1 = ax.bar(np.arange(15)+1,res)
# re2 = ax.bar(np.arange(15),res2)
# i = 0
# for re in re1:
#     re.set_facecolor(colors[i%10])
#     i+=1
i = 0
rects = ()  # Subplots 'array'
for re in res:
    re2 = ax.bar(i+1, re, color=colors[i%10])
    rects = rects + (re2[0],)
    # re.set_facecolor(colors[i%10])
    i+=1
baseline = ax.plot(np.arange(15), np.ones(15), "k--", linewidth=2)
rects = rects + (baseline[0],)



# rects = rects + (re1[0],)
# ax.set_xticks(tuple(xtick))
ax.set_xticks(ind+1)
ax.set_xticklabels(xtick, rotation='vertical')
ax.set_ylabel('Speedup of MatjuiceV2 (relative to MatJuice)', fontsize=20)
# ax.legend(rects, tuple([]), loc="upper right",fontsize=20)
# plt.set_xticks(ind)
# plt.xtick(ind, tuple(xtick), fontsize=18, rotation=40)

plt.savefig("./matjuicev2-matjuice.pdf",bbox_inches='tight', format="pdf")
plt.show()
