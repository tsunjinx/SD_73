import * as XLSX from 'xlsx'
import { exportToCSV } from './csvExport.js'

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects containing the data to export
 * @param {string} fileName - Name of the Excel file (without .xlsx extension)
 * @param {string} sheetName - Name of the worksheet
 * @param {Object} options - Additional options
 */
export const exportToExcel = (data, fileName, sheetName = 'Sheet1', options = {}) => {
  try {
    console.log('exportToExcel called with:', { data, fileName, sheetName })
    
    // Simple validation
    if (!data || !Array.isArray(data) || data.length === 0) {
      alert('❌ Không có dữ liệu để xuất')
      return { success: false, message: 'Không có dữ liệu để xuất' }
    }

    // Check if XLSX is available
    if (!XLSX || !XLSX.utils) {
      console.warn('XLSX library not available, falling back to CSV export')
      return exportToCSV(data, fileName)
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new()

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data, {
      header: options.headers || undefined,
      skipHeader: options.skipHeader || false
    })

    // Auto-size columns
    if (data.length > 0) {
      const range = XLSX.utils.decode_range(ws['!ref'])
      const colWidths = []
      
      // Calculate column widths based on content
      for (let C = range.s.c; C <= range.e.c; C++) {
        let maxWidth = 10 // minimum width
        
        for (let R = range.s.r; R <= range.e.r; R++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
          const cell = ws[cellAddress]
          
          if (cell && cell.v) {
            const cellLength = String(cell.v).length
            maxWidth = Math.max(maxWidth, cellLength)
          }
        }
        
        colWidths.push({ wch: Math.min(maxWidth + 2, 50) }) // cap at 50 characters
      }
      
      ws['!cols'] = colWidths
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Generate file and save
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const fullFileName = `${fileName}_${timestamp}.xlsx`
    
    console.log('Attempting to write file:', fullFileName)
    XLSX.writeFile(wb, fullFileName)
    
    return {
      success: true,
      fileName: fullFileName,
      message: `File Excel đã được xuất thành công: ${fullFileName}`
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return {
      success: false,
      error: error.message,
      message: 'Có lỗi xảy ra khi xuất file Excel'
    }
  }
}

/**
 * Export multiple sheets to Excel file
 * @param {Array} sheets - Array of {data, sheetName} objects
 * @param {string} fileName - Name of the Excel file (without .xlsx extension)
 */
export const exportMultipleSheetsToExcel = (sheets, fileName) => {
  try {
    // Check if XLSX is available
    if (!XLSX || !XLSX.utils) {
      console.warn('XLSX library not available, cannot export multiple sheets')
      // For fallback, just export the first sheet as CSV
      if (sheets.length > 0) {
        return exportToCSV(sheets[0].data, fileName)
      }
      throw new Error('No sheets to export')
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new()

    sheets.forEach(({ data, sheetName, options = {} }) => {
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(data, {
        header: options.headers || undefined,
        skipHeader: options.skipHeader || false
      })

      // Auto-size columns
      if (data.length > 0) {
        const range = XLSX.utils.decode_range(ws['!ref'])
        const colWidths = []
        
        for (let C = range.s.c; C <= range.e.c; C++) {
          let maxWidth = 10
          
          for (let R = range.s.r; R <= range.e.r; R++) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
            const cell = ws[cellAddress]
            
            if (cell && cell.v) {
              const cellLength = String(cell.v).length
              maxWidth = Math.max(maxWidth, cellLength)
            }
          }
          
          colWidths.push({ wch: Math.min(maxWidth + 2, 50) })
        }
        
        ws['!cols'] = colWidths
      }

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName)
    })

    // Generate file and save
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const fullFileName = `${fileName}_${timestamp}.xlsx`
    
    XLSX.writeFile(wb, fullFileName)
    
    return {
      success: true,
      fileName: fullFileName,
      message: `File Excel đã được xuất thành công: ${fullFileName}`
    }
  } catch (error) {
    console.error('Error exporting multiple sheets to Excel:', error)
    return {
      success: false,
      error: error.message,
      message: 'Có lỗi xảy ra khi xuất file Excel'
    }
  }
}

/**
 * Format data for Excel export with Vietnamese headers
 * @param {Array} data - Raw data array
 * @param {Object} headerMapping - Mapping of field names to Vietnamese headers
 */
export const formatDataForExcel = (data, headerMapping = {}) => {
  return data.map(item => {
    const formattedItem = {}
    
    Object.keys(item).forEach(key => {
      const header = headerMapping[key] || key
      let value = item[key]
      
      // Format dates
      if (value instanceof Date) {
        value = value.toLocaleDateString('vi-VN')
      } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        // ISO date string
        value = new Date(value).toLocaleDateString('vi-VN')
      }
      
      // Format numbers
      if (typeof value === 'number' && value > 999) {
        value = value.toLocaleString('vi-VN')
      }
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        value = ''
      }
      
      formattedItem[header] = value
    })
    
    return formattedItem
  })
}