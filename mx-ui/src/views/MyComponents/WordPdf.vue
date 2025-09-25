<template>
  <div class="converter-container">
    <!-- 文本输入框 -->
    <div class="input-container">
      <textarea v-model="text" placeholder="输入文字"></textarea>
      <button @click="convertToImage">文本转图片</button>
    </div>

    <!-- 图片显示区 -->
    <div class="image-container">
      <img v-if="imageSrc" :src="imageSrc" alt="转换后的图片" />
      <button v-if="imageSrc" @click="imageToPDF">图片转PDF</button>
      <button v-if="imageSrc" @click="downloadImage">下载图片</button>
    </div>

    <!-- PDF 显示区 -->
    <div class="pdf-container">
      <iframe v-if="pdfSrc" :src="pdfSrc" type="application/pdf" width="100%" height="400px"></iframe>
      <button v-if="pdfSrc" @click="pdfToImage">PDF转图片</button>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'; // 引入jsPDF

export default {
  data() {
    return {
      text: '',
      imageSrc: null,
      pdfSrc: null,
    };
  },
  methods: {
    convertToImage() {
      // 使用 Canvas 将文本转换为图片
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 设置画布大小（这里简单设置为固定大小，可以根据文本长度动态调整）
      canvas.width = 500;
      canvas.height = 300;

      // 绘制背景
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 设置文本样式并绘制文本
      ctx.font = '20px Arial';
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'middle';
      const textY = canvas.height / 2;

      // 这里简单地将文本居中绘制，可以添加换行和更复杂的布局逻辑
      const textLines = this.text.split('\n');
      let textX = (canvas.width - ctx.measureText(textLines.join(' ')).width) / 2;
      textLines.forEach((line, index) => {
        ctx.fillText(line, textX, textY + (index - textLines.length / 2) * 25); // 25 是假设的行高
        // 注意：这里的文本布局非常基础，需要根据实际需求进行调整
      });

      // 将画布转换为图片并设置到 imageSrc
      canvas.toBlob((blob) => {
        this.imageSrc = URL.createObjectURL(blob);
      }, 'image/png');
    },
    downloadImage() {
      // 下载图片的逻辑
      if (this.imageSrc) {
        const link = document.createElement('a');
        link.href = this.imageSrc;
        link.download = 'converted_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    imageToPDF() {
      // 确保您有一个图片的URL
      if (!this.imageSrc) {
        alert('请先上传图片');
        return;
      }

      // 使用jsPDF创建一个新的PDF文档
      const doc = new jsPDF();

      // 将图片添加到PDF文档中
      const img = new Image();
      img.src = this.imageSrc; // 从data属性或任何其他来源获取图片URL
      img.onload = () => {
        const imgWidth = 210; // 您可以根据需要调整这个值
        const imgHeight = imgWidth * (img.height / img.width) || null; // 保持图片的纵横比
        const pageHeight = doc.internal.pageSize.getHeight();
        let heightLeft = imgHeight;
        let position = 0;

        // 如果图片高度超过PDF页面高度，则分页
        if (heightLeft > pageHeight) {
          let i = 1;
          doc.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          // 循环直到所有图片内容都添加到PDF中
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        } else {
          // 单页PDF
          doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
        }

        // 保存PDF文件
        doc.save('download-image-as-pdf.pdf');
        // 保存PDF文件并更新pdfSrc以在页面上显示
        // ...其他操作，比如添加图片等
          const url = doc.output('datauristring');
          this.pdfSrc = url; // 更新pdfSrc以显示PDF
      };
    },
    async pdfToImage() {
      if (!this.pdfSrc) {
        alert('请先上传PDF文件');
        return;
      }

      try {
        // 解码Base64字符串以获取PDF二进制数据
        const base64Data = this.pdfSrc.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // 使用PDF.js加载PDF文档
        const loadingTask = pdfJS.getDocument({data: byteArray});
        const pdfDoc = await loadingTask.promise;

        // 获取PDF的页数
        const numPages = await pdfDoc.numPages;

        // 遍历每一页，将每一页转换为图片
        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const scale = 2; // 缩放因子，增加DPI
          const viewport = page.getViewport({scale});
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          await page.render(renderContext).promise;
          const dataUrl = canvas.toDataURL('image/png');

          // 将图片显示在页面上或保存到服务器
          // 这里我们只是将图片添加到页面上
          const imgElement = document.createElement('img');
          imgElement.src = dataUrl;
          imgElement.alt = `Page ${i} of PDF`;
          document.body.appendChild(imgElement);
        }
      } catch (error) {
        console.error('Error converting PDF to images:', error);
        alert('转换PDF为图片时发生错误。');
      }
    }
  },
};
</script>

<style scoped>
.converter-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.input-container {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  height: 100px;
}

.image-container, .pdf-container {
  margin-bottom: 20px;
}

img {
  max-width: 100%;
  height: auto;
}

iframe {
  border: none;
}
</style>
