/**
 * Simple CSV export as a fallback for Excel export
 */

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects containing the data to export
 * @param {string} fileName - Name of the CSV file (without .csv extension)
 */
export const exportToCSV = (data, fileName) => {
  try {
    console.log('exportToCSV called with:', { data, fileName })
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      alert('❌ Không có dữ liệu để xuất')
      return { success: false, message: 'Không có dữ liệu để xuất' }
    }

    // Get headers from the first object
    const headers = Object.keys(data[0])
    
    // Create CSV content
    const csvContent = [
      // Header row
      headers.join(','),
      // Data rows
      ...data.map(row => 
        headers.map(header => {
          let value = row[header]
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            value = `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        }).join(',')
      )
    ].join('\\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const fullFileName = `${fileName}_${timestamp}.csv`
      
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', fullFileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return {
        success: true,
        fileName: fullFileName,
        message: `File CSV đã được xuất thành công: ${fullFileName}`
      }
    } else {
      throw new Error('Browser không hỗ trợ tải file')
    }
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    return {
      success: false,
      error: error.message,
      message: 'Có lỗi xảy ra khi xuất file CSV'
    }
  }
}