import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import jspdf from 'jspdf';
import BarcodeItem from '~app/features/print-barcode/components/PrintSize/BarcodeItem';
import {
  base64FontRoboto,
  base64FontRobotoBold,
  configPrintSize,
} from '~app/features/print-barcode/components/PrintSize/config';

function useBarcodePrinting({
  setting,
  selectedSkus,
}: {
  setting: BarcodePrintingSetting;
  selectedSkus: Array<SkuSelected>;
}) {
  const [content, setContent] = useState<ExpectedAny>('');
  const [typeSubmit, setTypeSubmit] = useState('');
  const [pageOptions, setPageOptions] = useState({
    widthPX: 792.96,
    widthIN: 8.26,
    heightPX: 1104,
    heightIN: 11.5,
    orientation: 'portrait',
  });
  const pdfRef = useRef(null);

  useEffect(() => {
    if (content.length > 0 && pdfRef.current) {
      if (typeSubmit === 'print') {
        handlePrintDirectly();
      } else {
        const pdfTable = document.getElementById('pdf');
        if (pdfTable) {
          const doc = new jspdf({
            unit: 'px',
            orientation: pageOptions.orientation as 'p' | 'portrait' | 'landscape' | 'l' | undefined,
            format: [pageOptions.widthPX, pageOptions.heightPX],
          });

          // define custom font
          doc.addFileToVFS('Roboto.ttf', base64FontRoboto); // add custom font to file
          doc.addFileToVFS('Roboto-bold.ttf', base64FontRobotoBold); // add custom font to file
          doc.addFont('Roboto.ttf', 'Roboto', 'normal');
          doc.addFont('Roboto-bold.ttf', 'Roboto', 'bold');
          doc.html(pdfTable, {
            callback: function (doc: ExpectedAny) {
              doc.save('barcode.pdf');
            },
            fontFaces: [],
            x: 0,
            y: 0,
          });
        }
      }
    }
  }, [content, pageOptions.heightPX, pageOptions.orientation, pageOptions.widthPX]);

  const handlePrint = (type: string) => {
    if (setting && setting.pageSize && setting.size && selectedSkus.length > 0) {
      const quantity = selectedSkus.reduce((acc, curr) => acc + curr.quantity, 0);
      const page = [];
      let pageSize = 0;
      let totalPage = 1;
      let itemWidth = 130;
      let itemHeight = 0;
      const pageStyle = { p: 8, pt: 0 };
      const newPageOptions = { ...pageOptions };
      //default for A5
      const barcodeOptions = {
        width: 130,
        height: 42,
        fontSize: 8,
      };
      const nameStyle = {
        fontSize: 10,
        maxHeight: 29,
        minHeight: 18,
        lineHeight: 11,
        sub: 55,
      };
      const priceStyle = {
        fontSize: 9,
        marginTop: -8.8,
      };
      if (type === 'print') {
        switch (configPrintSize[setting.pageSize][setting.size]) {
          case 'a5':
            totalPage = Math.ceil(quantity / 40);
            pageSize = 40;
            newPageOptions.widthPX = 758.4;
            newPageOptions.widthIN = 7.9;
            newPageOptions.heightPX = 634.56;
            newPageOptions.heightIN = 6.61;
            newPageOptions.orientation = 'landscape';
            break;
          case 'a4-145':
            totalPage = Math.ceil(quantity / 65);
            pageSize = 65;
            itemWidth = 150;
            barcodeOptions.height = 45;
            barcodeOptions.fontSize = 12;
            nameStyle.fontSize = 9;
            pageStyle.pt = 24;
            newPageOptions.widthPX = 792.96;
            newPageOptions.widthIN = 8.26;
            newPageOptions.heightPX = 1104;
            newPageOptions.heightIN = 11.5;
            newPageOptions.orientation = 'portrait';
            break;
          case 'a4-138':
            totalPage = Math.ceil(quantity / 100);
            pageSize = 100;
            itemWidth = 150;
            itemHeight = 48;
            barcodeOptions.fontSize = 10;
            barcodeOptions.height = 30;
            nameStyle.fontSize = 6;
            nameStyle.lineHeight = 7;
            nameStyle.maxHeight = 25;
            nameStyle.minHeight = 19;
            priceStyle.fontSize = 7;
            priceStyle.marginTop = -8;
            newPageOptions.widthPX = 792.96;
            newPageOptions.widthIN = 8.26;
            newPageOptions.heightPX = 1104;
            newPageOptions.heightIN = 11.5;
            newPageOptions.orientation = 'portrait';
            break;
          case 'a4-146':
            totalPage = Math.ceil(quantity / 180);
            pageSize = 180;
            itemWidth = 76;
            itemHeight = 57;
            barcodeOptions.fontSize = 14;
            barcodeOptions.height = 52;
            nameStyle.fontSize = 6;
            nameStyle.lineHeight = 7;
            nameStyle.maxHeight = 20;
            nameStyle.minHeight = 15;
            priceStyle.fontSize = 6;
            priceStyle.marginTop = -12.8;
            pageStyle.pt = 24;
            newPageOptions.widthPX = 792.96;
            newPageOptions.widthIN = 8.26;
            newPageOptions.heightPX = 1104;
            newPageOptions.heightIN = 11.5;
            newPageOptions.orientation = 'portrait';
            break;
          case '110x22':
            barcodeOptions.height = 40;
            barcodeOptions.fontSize = 14;
            barcodeOptions.width = 150;
            totalPage = Math.ceil(quantity / 3);
            pageSize = 3;
            newPageOptions.widthPX = 410.88;
            newPageOptions.widthIN = 4.28;
            newPageOptions.heightPX = 76.8;
            newPageOptions.heightIN = 0.8;
            newPageOptions.orientation = 'landscape';
            nameStyle.fontSize = 9;
            nameStyle.lineHeight = 10;
            nameStyle.maxHeight = 21;
            nameStyle.minHeight = 12;
            priceStyle.fontSize = 12;
            priceStyle.marginTop = -4;
            break;
          default:
            barcodeOptions.height = 40;
            barcodeOptions.fontSize = 13;
            totalPage = Math.ceil(quantity / 2);
            pageSize = 2;
            newPageOptions.widthPX = 282.24;
            newPageOptions.widthIN = 2.94;
            newPageOptions.heightPX = 76.8;
            newPageOptions.heightIN = 0.8;
            newPageOptions.orientation = 'landscape';
            nameStyle.fontSize = 9;
            nameStyle.lineHeight = 10;
            nameStyle.maxHeight = 26;
            priceStyle.fontSize = 10;
            break;
        }
      } else {
        switch (configPrintSize[setting.pageSize][setting.size]) {
          case 'a5':
            totalPage = Math.ceil(quantity / 40);
            pageSize = 40;
            barcodeOptions.height = 28;
            barcodeOptions.fontSize = 10;
            newPageOptions.widthPX = 758.4;
            newPageOptions.widthIN = 7.9;
            newPageOptions.heightPX = 634.56;
            newPageOptions.heightIN = 6.61;
            newPageOptions.orientation = 'landscape';
            nameStyle.sub = 42;
            nameStyle.minHeight = 26;
            nameStyle.lineHeight = 10;
            priceStyle.fontSize = 10;
            priceStyle.marginTop = -8;
            break;
          case 'a4-145':
            totalPage = Math.ceil(quantity / 65);
            pageSize = 65;
            itemWidth = 150;
            barcodeOptions.width = 120;
            barcodeOptions.height = 30;
            barcodeOptions.fontSize = 9;
            nameStyle.fontSize = 7;
            nameStyle.lineHeight = 9;
            nameStyle.sub = 70;
            nameStyle.minHeight = 24;
            pageStyle.pt = 24;
            newPageOptions.widthPX = 792.96;
            newPageOptions.widthIN = 8.26;
            newPageOptions.heightPX = 1104;
            newPageOptions.heightIN = 11.5;
            newPageOptions.orientation = 'portrait';
            priceStyle.marginTop = -5.6;
            priceStyle.fontSize = 10;
            break;
          case 'a4-138':
            totalPage = Math.ceil(quantity / 100);
            pageSize = 100;
            itemWidth = 150;
            itemHeight = 54;
            barcodeOptions.fontSize = 6;
            barcodeOptions.height = 20;
            nameStyle.fontSize = 6;
            nameStyle.lineHeight = 7;
            nameStyle.minHeight = 20;
            nameStyle.sub = 100;
            priceStyle.fontSize = 7;
            priceStyle.marginTop = -7.2;
            newPageOptions.widthPX = 792.96;
            newPageOptions.widthIN = 8.26;
            newPageOptions.heightPX = 1104;
            newPageOptions.heightIN = 11.5;
            newPageOptions.orientation = 'portrait';
            break;
          case 'a4-146':
            totalPage = Math.ceil(quantity / 180);
            pageSize = 180;
            itemWidth = 76;
            itemHeight = 57;
            barcodeOptions.fontSize = 5;
            barcodeOptions.height = 25;
            nameStyle.fontSize = 6;
            nameStyle.lineHeight = 7;
            nameStyle.minHeight = 20;
            nameStyle.sub = 55;
            priceStyle.fontSize = 6;
            priceStyle.marginTop = -5.6;
            pageStyle.pt = 24;
            newPageOptions.widthPX = 792.96;
            newPageOptions.widthIN = 8.26;
            newPageOptions.heightPX = 1104;
            newPageOptions.heightIN = 11.5;
            newPageOptions.orientation = 'portrait';
            break;
          case '110x22':
            barcodeOptions.height = 30;
            barcodeOptions.width = 150;
            totalPage = Math.ceil(quantity / 3);
            pageSize = 3;
            itemWidth = 135;
            newPageOptions.widthPX = 410.88;
            newPageOptions.widthIN = 4.28;
            newPageOptions.heightPX = 76.8;
            newPageOptions.heightIN = 0.8;
            newPageOptions.orientation = 'landscape';
            nameStyle.fontSize = 9;
            nameStyle.lineHeight = 9;
            nameStyle.minHeight = 24;
            nameStyle.sub = 55;
            priceStyle.fontSize = 11;
            pageStyle.p = 0;
            pageStyle.pt = 0;
            break;
          default:
            barcodeOptions.height = 30;
            totalPage = Math.ceil(quantity / 2);
            pageSize = 2;
            itemWidth = 135;
            newPageOptions.widthPX = 282.24;
            newPageOptions.widthIN = 2.94;
            newPageOptions.heightPX = 76.8;
            newPageOptions.heightIN = 0.8;
            newPageOptions.orientation = 'landscape';
            nameStyle.fontSize = 9;
            nameStyle.lineHeight = 9;
            nameStyle.minHeight = 24;
            nameStyle.sub = 55;
            priceStyle.fontSize = 11;
            pageStyle.p = 0;
            pageStyle.pt = 0;
            break;
        }
      }

      const barcodeItems = [];
      for (let i = 0; i < selectedSkus.length; i++) {
        const sku = selectedSkus[i];
        if (sku) {
          for (let skuIndex = 0; skuIndex < sku.quantity; skuIndex++) {
            barcodeItems.push(
              <BarcodeItem
                key={sku.id + String(skuIndex)}
                id={skuIndex + i + sku.id}
                setting={setting}
                sku={sku}
                itemHeight={itemHeight}
                itemWidth={itemWidth}
                barcodeOptions={barcodeOptions}
                nameStyle={nameStyle}
                priceStyle={priceStyle}
              />,
            );
          }
        }
      }
      for (let i = 1; i <= totalPage; i++) {
        const firstPageIndex = (i - 1) * pageSize;
        const items = barcodeItems.slice(firstPageIndex, firstPageIndex + pageSize);
        page.push(
          <div
            style={{
              height: `calc(${newPageOptions.heightPX}px - ${i === totalPage ? '3px' : '0px'})`,
              width: newPageOptions.widthPX,
            }}
          >
            <div
              className="pw-grid "
              style={{
                gridTemplateColumns: generateColumns().columns,
                gridTemplateRows: generateColumns().rows,
                justifyItems: 'center',
                height: 'auto',
                padding: pageStyle.p,
                paddingTop: pageStyle.pt,
              }}
            >
              {items}
            </div>
          </div>,
        );
      }
      setPageOptions(newPageOptions);
      setContent(page);
      setTypeSubmit(type);
    }
  };

  const generateColumns = () => {
    if (setting && setting.pageSize && setting.size && selectedSkus.length > 0) {
      switch (configPrintSize[setting.pageSize][setting.size]) {
        case 'a5':
        case 'a4-138':
          return { columns: 'repeat(5, 1fr)', rows: 'repeat(20, 1fr)' };
        case 'a4-145':
          return { columns: 'repeat(5, 1fr)', rows: '' };
        case 'a4-146':
          return { columns: 'repeat(10, 1fr)', rows: '' };
        case '110x22':
          return { columns: 'repeat(3, 1fr)', rows: '' };
        default:
          return { columns: 'repeat(2, 1fr)', rows: '' };
      }
    }
    return { columns: 'repeat(2, 1fr)', rows: '' };
  };

  const showDataPrint = () => (
    <div
      id="pdf"
      ref={pdfRef}
      style={{
        width: 'fit-content',
      }}
    >
      {content}
    </div>
  );
  const handlePrintDirectly = useReactToPrint({
    content: () => pdfRef.current,
  });

  return { handlePrint, showDataPrint };
}

export { useBarcodePrinting };
