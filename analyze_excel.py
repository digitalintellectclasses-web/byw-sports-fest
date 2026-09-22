import pandas as pd
import json
import traceback

def analyze():
    try:
        xls = pd.ExcelFile(r'E:\projects\byw\UPDATED_FINAL_BYW_Sports_Fest_Tracker_With_Qualifiers_Semis_Finals.xlsx')
        report = []
        for sheet in xls.sheet_names:
            df = pd.read_excel(xls, sheet)
            report.append(f'--- {sheet} ---')
            report.append(f'Columns: {", ".join([str(c) for c in df.columns])}')
            report.append(df.head(5).to_string())
            report.append('')
        
        with open(r'E:\projects\byw\analysis.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(report))
        print("Analysis written to analysis.txt")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    analyze()
